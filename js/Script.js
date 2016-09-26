
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
	var add = 0;

	for (i = 0; i < copy.length; i++) {
		add += copy[i];
	}

	for ( i = 0; i < copy.length; i++) {
		lem[i] = {id: i ,label: copy[i]};
		nodes.push(lem[i]);
	}
	console.log(JSON.stringify(nodes));

	var array = new Array();
	var edge = 0;

	for (i = 0; i < copy.length; i++){
		array[i] = new data(copy[i],i);
	}
	console.log(JSON.stringify(array));

	for (var j = 0; j < copy.length; j++) {
		if(array[0].data1 > 0){
			for (i = 1; i <= array[0].data1; i++) {
				array[i].data1--;
				lem[i] = {source:array[0].id, target:array[i].id};
				links.push(lem[i]);
				edge++;
			}
			array[0].data1 = 0;
			object_array_sort(array, 'data1', 0, function(new_data){
				//ソート後の処理
				console.log(JSON.stringify(new_data)); //
			});
			console.log(JSON.stringify(array));
		}
	}

	/*
	while(long > 1){
		head = copy[0];
		if(head > 0){
			for ( i = 0; i < head; i++) {
				lem[i] = {source:admin, target:admin+1+i};
				links.push(lem[i]);
				edge++;
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
	//*/
	console.log("エッジの数:"+edge);

	if (add % 2 === edge) {
		console.log("nodes error");
		return 0;
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

function data(data1, id){
	this.data1 = data1;
	this.id = id;
}

function object_array_sort(data,key,order,fn){
	//デフォは降順(DESC)
	var num_a = -1;
	var num_b = 1;

	if(order === 'asc'){//指定があれば昇順(ASC)
		num_a = 1;
		num_b = -1;
	}

	data = data.sort(function(a, b){
		var x = a[key];
		var y = b[key];
		if (x > y) return num_a;
		if (x < y) return num_b;
		return 0;
	});

	fn(data); // ソート後の配列を返す
}