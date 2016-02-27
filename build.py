import sys
import time
import argparse
import subprocess as sp
from jsmin import jsmin
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler
from watchdog.events import FileSystemEventHandler
import os


class ModuleChangeEventHandler(FileSystemEventHandler):
	def __init__(self, params):
		self.params = params

	def on_modified(self, event):
		print(event)

		p = self.params

		# depending on compilation option here
		if p.compile == "jsmin":
			with open(p.dest, "w") as of:
				for srcfile in p.source:
					with open(p.path + srcfile, "r") as src:
						of.write(jsmin(src.read()))	

		# advanced compilation is too aggressive and kills the properties I want to export
		elif p.compile == "closure":
			sp.run(["closure_compiler.bat", "--compilation_level", "SIMPLE_OPTIMIZATIONS", "--js"] +
				[p.path + src for src in p.source] + ["--js_output_file", "temptemptemp.js"])
			os.remove(p.dest)
			os.rename("temptemptemp.js", p.dest)


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
		default=["Context2DTracked.js", "utility.js", "names.js", "drawfigure.js", "player.js", "clothing.js"],
		help="names of the JS source files in the order they should be added;\
		default: %(default)s")

	parser.add_argument("-d", "--dest", 
		default="da.js",
		help="name of the destination file to be written to (will override existing file!);\
		default: %(default)s")

	parser.add_argument("-c", "--compile",
		default="jsmin",
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
