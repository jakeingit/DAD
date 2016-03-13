import sys
import time
import argparse
import subprocess as sp
from jsmin import jsmin
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler
from watchdog.events import FileSystemEventHandler
import os
import time

license = """/* Copyright 2012 Tuatha, 2016 Johnson Zhong
   Originally created by Tuatha, totally overhauled by Johnson
   Feel free to include this into your game, 
   just remember to credit and leave the license in place.

   To use, just copy the entire content of this file to the top of your Javascript.
*/"""

class ModuleChangeEventHandler(FileSystemEventHandler):
	def __init__(self, params):
		self.params = params
		self.lastcomp = 0

	def on_modified(self, event):
		print(event)
		if time.time() < self.lastcomp + 5:
			print("skipping duplicate event")
			return
		else:
			self.lastcomp = time.time()

		p = self.params

		# always manually concat first to ensure loading order
		with open(p.dest, "w") as of:
			for srcfile in p.source:
				with open(p.path + srcfile, "r") as src:
					if p.compile == "jsmin":
						of.write(jsmin(src.read()))	
					else:
						of.write(src.read())

		# advanced compilation is too aggressive and kills the properties I want to export
		if p.compile == "closure":
			try:
				os.remove("temptemptemp.js")
			except OSError:
				pass
			sp.run(["closure_compiler.bat", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--js"] +
				[p.dest] + ["--js_output_file", "temptemptemp.js"])
			try:
				os.remove(p.dest)
			except OSError:
				pass
			os.rename("temptemptemp.js", p.dest)

		# put license in at the top
		with open(p.dest, 'r+') as f:
			content = f.read()
			f.seek(0,0)
			f.write(license + '\n' + content)


def parse_args(ns=None):
	parser = argparse.ArgumentParser(
		description="Build draw avatar (da) module from source into one JS file.",
		usage="%(prog)s [OPTIONS]")

	parser.add_argument("-p", "--path",
		default="js",
		help="directory of where the source Javascript files are;\
		default: %(default)s")

	parser.add_argument("-s", "--source",
		nargs="+",
		default=["matrix.js", "Context2DTracked.js", "utility.js", "names.js",
		 "skeleton.js", "hair.js", "player.js", "drawfigure.js", 
		 "patterns.js", "ctptop.js", "ctpbot.js", "ctpshoes.js", "ctpacc.js", "clothing.js"],
		help="names of the JS source files in the order they should be added;\
		default: %(default)s")

	parser.add_argument("-d", "--dest", 
		default="da.js",
		help="name of the destination file to be written to (will override existing file!);\
		default: %(default)s")

	parser.add_argument("-c", "--compile",
		default="jsmin",
		choices=["none","jsmin","closure"],
		help="choice of compiler to minify and optimize the source;\
		default: %(default)s")

	params = parser.parse_args(namespace=ns)
	# add trailing slash if missing it
	if params.path[-1] != '/':
		params.path = params.path + '/'

	return params

if __name__ == "__main__":

	params = parse_args()

	event_handler = ModuleChangeEventHandler(params)

	observer = Observer()
	observer.schedule(event_handler, params.path, recursive=True)
	observer.start()
	try:
		while True:
			time.sleep(1)
	except KeyboardInterrupt:
		observer.stop()
	observer.join()
