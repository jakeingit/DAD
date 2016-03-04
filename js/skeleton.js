"use strict";
var da = (function(da){

/** provide drawfigure with information about where to start drawing
 *	also defines special racial features to be drawn such as pointy ears */
da.racialSkeleton = {
	human: {
		upper: {
			m: {
				// base level values without x and y have implied x = 79
				top:48,
				neck:68,
				collarbone: {x:41, y:72},
				elbow: {x:10, y:144},	// outer elbow
				wrist: {x:9, y:211},	// outer wrist
				knuckle: {x:20, y:226},	// knuckles/tip of hand
				finger: {x:26, y:222},	// end of fingers
				rib: {x:44, y:115},		// armpit

				chin: {x:79, y:63},
				jaw: {x:59, y:47},
				ear: {x:59, y:37, cp2:{x:56, y:37}, cp1:{x:55, y:29}},
				skull: {x:79, y:5},	
			},
			f: {
				top:48,
				neck:63,
				collarbone: {x:46, y:70},
				elbow: {x:24, y:138},
				wrist: {x:14, y:193},
				knuckle: {x:15, y:213},
				finger: {x:29, y:214},
				ulna: {x:22, y:191},
				rib: {x:46, y:108},

				chin: {x:79, y:62},
				jaw: {x:59, y:44},
				ear: {x:59, y:37, cp2:{x:56, y:37}, cp1:{x:55, y:30}},
				skull: {x:79, y:8.4},
			},
		},
		mid: {
			hip: {x:50.3, y:175},
			pelvis: 180,
		},
		lower: {
			m: {
				knee: {x:36, y:269},
				ankle: {x:41, y:365},
				toe: {
					out: {x:29, y:388, cp1:{x:34, y:386}},
					mid: {x:29, y:390, cp1:{x:29, y:389}},
					in: {x:59, y:389, cp1:{x:43, y:394}},
				},
				shin: {x:54, y:342},
				cocyx: {x:79, y:205},
			},
			f: {
				knee: {x:44, y:275},
				ankle: {x:39, y:364},
				toe: {
					out: {x:30, y:384, cp1:{x:36, y:372}},
					mid: {x:33, y:387, cp1:{x:32, y:386}},
					in: {x:52, y:386, cp1:{x:40, y:391}},
				},
				shin: {x:50, y:353},
				cocyx: {x:79, y:203},
			}
		}
	},
};

return da;
}(da || {}));