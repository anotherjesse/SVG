/** simple svg in javascript
 *
 * @param: the order in the geometry functions follow a general guideline
 *  - the necessary parameters for the geometry, number of params varies
 *  - className
 *  - id
 *  - the parent container to append this new element
 *
 * you can set all these later. some are more important than others.
 * if you don't use the parent parameter, you'll want to append 
 * this object to an SVG or group using .appendChild 
 *
 * @returns: the new geometry XML object.
 */

import vkbeautify from '../lib/vkbeautify';

const svgNS = "http://www.w3.org/2000/svg";

/**
 * geometry primitives
 */

export function line(x1, y1, x2, y2, className, id, parent) {
	let shape = document.createElementNS(svgNS, "line");
	shape.setAttributeNS(null, "x1", x1);
	shape.setAttributeNS(null, "y1", y1);
	shape.setAttributeNS(null, "x2", x2);
	shape.setAttributeNS(null, "y2", y2);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function circle(x, y, radius, className, id, parent) {
	let shape = document.createElementNS(svgNS, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r", radius);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function rect(x, y, width, height, className, id, parent) {
	let shape = document.createElementNS(svgNS, "rect");
	shape.setAttributeNS(null, "x", x);
	shape.setAttributeNS(null, "y", y);
	shape.setAttributeNS(null, "width", width);
	shape.setAttributeNS(null, "height", height);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function polygon(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polygon");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function polyline(pointsArray, className, id, parent) {
	let shape = document.createElementNS(svgNS, "polyline");
	setPoints(shape, pointsArray);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y,
		toX, toY, className, id, parent) {
	let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y +
			" " + c2X + "," + c2Y + " " + toX + "," + toY;
	let shape = document.createElementNS(svgNS, "path");
	shape.setAttributeNS(null, "d", d);
	setClassIdParent(shape, className, id, parent);
	return shape;
}

export function regularPolygon(cX, cY, radius, sides, className, id, parent){
	let halfwedge = 2*Math.PI/sides * 0.5;
	let r = Math.cos(halfwedge) * radius;
	let points = Array.from(Array(sides))
		.map((_,i) => {
			var a = -2 * Math.PI * i / sides + halfwedge;
			var x = cX + r * Math.sin(a);
			var y = cY + r * Math.cos(a);
			return [x, y];
		});
	return polygon(points, className, id, parent);
}

// export function curve(fromX, fromY, midX, midY, toX, toY, className, id)

/**
 * container types
 */

export function group(className, id, parent) {
	let g = document.createElementNS(svgNS, "g");
	setClassIdParent(g, className, id, parent);
	return g;
}

export function svg(className, id, parent) {
	let svg = document.createElementNS(svgNS, "svg");
	// svg.setAttributeNS(null, "viewBox", "0 0 1 1");
	setClassIdParent(svg, className, id, parent);
	return svg;
}

function setClassIdParent(element, className, id, parent) {
	if (className != null) {
		element.setAttributeNS(null, "class", className);
	}
	if (id != null) {
		element.setAttributeNS(null, "id", id);
	}
	if (parent != null) {
		parent.appendChild(element);
	}
}

/**
 * geometry modifiers
 */

export function setPoints(polygon, pointsArray){
	if (pointsArray == null || pointsArray.constructor !== Array) {
		return;
	}
	let pointsString = pointsArray.map((el) => (
		el.constructor === Array ? el : [el.x, el.y]
	)).reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	polygon.setAttributeNS(null, "points", pointsString);
}

/**
 * element modifiers
 */

export function addClass(xmlNode, newClass) {
	if (xmlNode == undefined) {
		return;
	}
	let currentClass = xmlNode.getAttribute("class");
	if (currentClass == undefined) {
		currentClass = "";
	}
	let classes = currentClass.split(" ").filter((c) => c !== newClass);
	classes.push(newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
}

export function removeClass(xmlNode, newClass) {
	if (xmlNode == undefined) {
		return;
	}
	let currentClass = xmlNode.getAttribute("class");
	if (currentClass == undefined) {
		currentClass = "";
	}
	let classes = currentClass.split(" ").filter((c) => c !== newClass);
	xmlNode.setAttributeNS(null, "class", classes.join(" "));
}

export function setId(xmlNode, newID) {
	if (xmlNode == undefined) {
		return;
	}
	xmlNode.setAttributeNS(null, "id", newID);
}

export function setAttribute(xmlNode, attribute, value) {
	if (xmlNode == undefined) {
		return;
	}
	xmlNode.setAttributeNS(null, attribute, value);
}

export function removeChildren(group) {
	while (group.lastChild) {
		group.removeChild(group.lastChild);
	}
}

/**
 * math, view
 */

export function setViewBox(svg, x, y, width, height, padding = 0) {
// let d = (bounds.size.width / _zoom) - bounds.size.width;
	let scale = 1.0;
	let d = (width / scale) - width;
	let X = (x - d) - padding;
	let Y = (y - d) - padding;
	let W = (width + d * 2) + padding * 2;
	let H = (height + d * 2) + padding * 2;
	let viewBoxString = [X, Y, W, H].join(" ");
	svg.setAttributeNS(null, "viewBox", viewBoxString);
}

export function setDefaultViewBox(svg){
	let rect = svg.getBoundingClientRect();
	let width = rect.width == 0 ? 640 : rect.width;
	let height = rect.height == 0 ? 480 : rect.height;
	setViewBox(svg, 0, 0, width, height);
}

export function getViewBox(svg){
	let vb = svg.getAttribute("viewBox");
	return vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n));
}

export function scale(svg, scale, origin_x = 0, origin_y = 0){
	if(scale < 1e-8){ scale = 0.01; }
	let matrix = svg.createSVGMatrix()
		.translate(origin_x, origin_y)
		.scale(1/scale)
		.translate(-origin_x, -origin_y)
	let viewBox = getViewBox(svg);
	if (viewBox == null){
		setDefaultViewBox(svg);
	}
	let top_left = svg.createSVGPoint();
	let bot_right = svg.createSVGPoint();
	top_left.x = viewBox[0];
	top_left.y = viewBox[1];
	bot_right.x = viewBox[0] + viewBox[2];
	bot_right.y = viewBox[1] + viewBox[3];
	let new_top_left = top_left.matrixTransform(matrix);
	let new_bot_right = bot_right.matrixTransform(matrix);
	setViewBox(svg, 
		new_top_left.x,
		new_top_left.y,
		new_bot_right.x - new_top_left.x,
		new_bot_right.y - new_top_left.y
	);
}

export function translate(svg, dx, dy){
	let viewBox = getViewBox(svg);
	if (viewBox == null){
		setDefaultViewBox(svg);
	}
	viewBox[0] += dx;
	viewBox[1] += dy;
	svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
}

export function convertToViewBox(svg, x, y) {
	let pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	let svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	var array = [svgPoint.x, svgPoint.y];
	array.x = svgPoint.x;
	array.y = svgPoint.y;
	return array;
}

export function download(svg, filename = "image.svg"){
	var a = document.createElement('a');
	var source = (new window.XMLSerializer()).serializeToString(svg);
	let formatted = vkbeautify.xml(source);
	var blob = new Blob([formatted], {type: 'text/plain'});
	a.setAttribute('href', window.URL.createObjectURL(blob));
	a.setAttribute('download', filename);
	a.click();	
}

const parserErrorNS = (new window.DOMParser())
	.parseFromString('INVALID', 'text/xml')
	.getElementsByTagName("parsererror")[0]
	.namespaceURI;

function parseCSSText(styleContent) {
	var styleElement = document.createElement("style");
	styleElement.textContent = styleContent;
	document.body.appendChild(styleElement);
	var rules = styleElement.sheet.cssRules;
	document.body.removeChild(styleElement);
	return rules;
}

// the SVG is returned, or given as the argument in the callback(svg, error)
export function load(input, callback){
	// try cascading attempts at different possible param types
	// "input" is a (1) raw text encoding of the svg (2) filename (3) already parsed DOM element
	if (typeof input === "string" || input instanceof String){
		// (1) raw text encoding
		var xml = (new window.DOMParser()).parseFromString(input, 'text/xml');
		if(xml.getElementsByTagNameNS(parserErrorNS, 'parsererror').length === 0) {
			if(callback != null){
				callback(xml);
			}
			return xml;
		}
		// (2) filename
		fetch(input)
			.then(response => response.text())
			.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
			.then(svgData => {
				var cssStyle, styleTag = svgData.getElementsByTagName('style')[0];
				if(styleTag != null
					&& styleTag.childNodes != null
					&& styleTag.childNodes.length > 0) {
					cssStyle = parseCSSText( styleTag.childNodes[0].nodeValue );
				}
				var allSVGs = svgData.getElementsByTagName('svg');
				if(allSVGs == null || allSVGs.length == 0) {
					throw "error, the svg parser found valid XML but couldn't find an SVG element";
				}
				let svg = allSVGs[0];
				if(callback != null) {
					callback(svg);
				}
				return svg;
			}).catch(err => callback(null, err))
	} else if (input instanceof Document){
		// (3) already parsed SVG... why would this happen? IDK. just return it
		callback(input);
		return input;
	}
}

