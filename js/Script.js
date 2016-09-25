
var w = 600;
var h = 600;

var nodes = [];
var links = [];
var lem = new Array();
var svg;

function onClick(){
	var text = document.txtb.txt.value;	//テキストボックスから数列の取得
	var elem = text.split(",").map(function(element) { return Number(element)});	//取り出した数列からカンマを消去し数値にキャスト
	var copy = elem.concat();	//あとで可視化に使うためのコピー

	var temp;
	while(elem[0] > 1){
		temp = process(elem);
		if(temp==false){
			alert("これグラフ的じゃないやん……");
			return 0;
		}
	}
	var result = judge(elem);

	if (result == true){
		alert("グラフ的です。よってグラフを視覚的に表現します。");
		vision(copy);
	}else{
		alert("これグラフ的じゃないやん……");
	}
}

function process(elem){
	var cnt = 0;
	var	top = elem[0];
	elem.shift();
	console.log(elem);
	if(top < elem.length){
		for (var i = 0; i < top; i++) {
			elem[i] = elem[i]-1;
		}
		console.log(elem);
	}else{
			return false;
	}

	elem.sort(function(a,b){
		return (a < b ? 1 : -1);
	});	//降順ソート
	console.log(elem);

	if(elem[elem.length - 1] < 0){
		return false;
	}else{
		return true ;
	}
};

function judge(elem){
	var count = 0;

	for (i = 0; i < elem.length; i++){
		if (elem[i]== 1){
			count++;
		}
	}
	if( count%2 == 0 ){
		return true;
	}else{
		return false;
	}
}

function vision(copy){
	var head;
	var counter;
	for ( i = 0; i < copy.length; i++) {
		lem[i] = {id: 1 ,label: copy[i]};
		nodes.push(lem[i]);
	}
	console.log(JSON.stringify(nodes));

	var admin = 0;
	var long = copy.length;
	while(long > 1){
		head = copy[0];
		if(head > 0){
			for ( i = 0; i < head; i++) {
				lem[i] = {source:admin, target:admin+1+i};
				links.push(lem[i]);
			}
			copy.shift();
			for (i = 0; i < head; i++){
				copy[i] = copy[i]-1;
			}
			console.log(copy);
		}else{
			copy.shift();
		}
		console.log(JSON.stringify(links));
		admin++;
		long--;
	}

	var force =   d3.layout.force()
					.nodes(nodes)
					.links(links)
					.size([w, h])
					.linkStrength(0.1)
					.friction(0.9)
					.distance(200)
					.charge(-30)
					.gravity(0.1)
					.theta(0.8)
					.alpha(0.1)
					.start();
	var svg = d3.select("body").select("output").append("svg").attr({width:w, height:h});
	//*
	var link =   svg.selectAll("line")
					.data(links)
					.enter()
					.append("line")
					.style({stroke: "#ccc","stroke-width": 1});
	var node =   svg.selectAll("circle")
					.data(nodes)
					.enter()
					.append("circle")
					.attr({r: 15,opacity: 0.5})
					.style({fill: "red"})
					.call(force.drag);
	//*
	force.on("tick", function() {
		 link.attr({x1: function(d) { return d.source.x; },
					y1: function(d) { return d.source.y; },
					x2: function(d) { return d.target.x; },
					y2: function(d) { return d.target.y; }});
		 node.attr({cx: function(d) { return d.x; },
					cy: function(d) { return d.y; }});
		});
	//*/
}


