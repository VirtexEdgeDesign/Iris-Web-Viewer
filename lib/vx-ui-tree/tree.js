
function vxTreeControl (divID) {

	// First create the Tree Control
 	this.divID = divID;
    this.tree = document.createElement("DIV");
    this.tree.setAttribute("id", "tree_"+divID);
    this.tree.classList.add("tree-control");

    document.getElementById(divID).appendChild(this.tree);

    this.visible = true;
}


vxTreeControl.prototype.ToggleVisibility = function(newNode) {
	if(this.visible == true)
	{
		this.visible = false;
		document.getElementById("tree_"+this.divID).style.display = "none";
	}
	else{
		this.visible = true;
		document.getElementById("tree_"+this.divID).style.display = "block";
	}
};

vxTreeControl.prototype.SetRootNode = function(newNode) {
	this.tree.appendChild(newNode.treenode);
};

vxTreeControl.prototype.AddNode = function(newNode, parentNodeID) {
	var parent = document.getElementById(parentNodeID);
	if(parent){
		var li = document.createElement("li");
		li.appendChild(newNode.treenode);
		parent.appendChild(li);

		// Now tell the parent node it has children so the arrow texture will show
		var arw = parent.getElementsByClassName("tree-node-arrow")[0];
		arw.setAttribute("show", "yes");
	}
};

function vxTreeNode (id, text, icon) {

	// Set up variables
	this.IsChecked = true;

	if(!icon){
		icon = "default";
	}
	// Now create the HTML elements

	// First, the UL
    this.treenode = document.createElement("ul");
    this.treenode.classList.add("tree-node");
    this.treenode.setAttribute("id", id);

	// Next, the Arrow
	//<input type="checkbox" id="toggle">
	//<label for="toggle" class="tree-node-arrow"></label>
    this.arrowInpt = document.createElement("input");
    this.arrowInpt.setAttribute("type", "checkbox");
    
    this.arrowInpt.setAttribute("id", "arw_"+id);
	this.treenode.appendChild(this.arrowInpt);

    this.arrowLabel = document.createElement("label");
    this.arrowLabel.classList.add("tree-node-arrow");
	this.arrowLabel.setAttribute("for", "arw_"+id);
	//this.arrowInpt.setAttribute("id", "arw_img_"+id);
	this.arrowLabel.setAttribute("show", "no");
	this.treenode.appendChild(this.arrowLabel);
	

	//<button class="tree-node-chkbx"><img class="tree-node-chkbx-img"/></button>
	//<span>Hello</span>
    this.CheckBox = document.createElement("button");
    this.CheckBox.classList.add("tree-node-chkbx");
    this.CheckBox.setAttribute("id", "chkbx_"+id);
    this.CheckBox.addEventListener("click", function(e) {
    	var img = e.path[0];
    	var isChecked = false;

    	if(img.getAttribute("status")=="checked"){
    		isChecked = false;
			img.setAttribute("status", "not-checked"); // added line
    	}
    	else{
    		isChecked = true;
    		img.setAttribute("status", "checked"); // added line
    	}

    	this.setAttribute("toggle", isChecked); // added line
    	var event = new CustomEvent('onNodeCheckChanged', 
    		{ 
    			detail:{
    			 nodeId: id ,
    			 isChecked: isChecked
    			}
    		});
		// target can be any Element or other EventTarget.
		this.dispatchEvent(event);
    });
    
    this.chkBxImg = document.createElement("img");
    this.chkBxImg.setAttribute("status", "checked"); // added line
    this.chkBxImg.classList.add("tree-node-chkbx-img");
    this.CheckBox.appendChild(this.chkBxImg);
	this.treenode.appendChild(this.CheckBox);

	this.Text = document.createElement("span");	
	this.Text.innerHTML = text;
	this.Text.setAttribute("icon", icon);
	this.treenode.appendChild(this.Text);

}

vxTreeNode.prototype.AddNode = function(newNode) {
	var li = document.createElement("li");
	li.appendChild(newNode.treenode);
	this.treenode.appendChild(li);
	this.arrowLabel.setAttribute("show", "yes");
};


vxTreeNode.prototype.Expand = function(newNode) {
	this.arrowInpt.setAttribute("checked", "checked"); // added line
};

vxTreeNode.prototype.Collapse = function(newNode) {
this.arrowInpt.setAttribute("checked", ""); // added line
};