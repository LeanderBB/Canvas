/** Initial Set Up ************************************************************/
window.onload( function(){
	menu = new MenuController();
	menu.init();
});

/** Menu Controller ***********************************************************/
function MenuController(){
	
}

/** Menu Model ****************************************************************/
function MenuModel(){
	
}

/** Menu View *****************************************************************/
function ViewMenu(){
	this.width  = $(window).width();
	this.height = $(window).height();
}

function menu_main_close()
{
	if($("#main_menu").css("opacity") == 0)
	{
			$("#main_menu").css("opacity","1");
	}
	else
	{
			$("#main_menu").css("opacity","0");
	}
}

function menu_main_right()
{
	$("#main_panel").css("-moz-transform", "translateX(-800px");
}

function menu_main_left()
{
	$("#main_panel").css("-moz-transform", "translateX(0px");
}


/* Bind all animations */
function menu_bind_animations()
{
	$("#main_close").click(menu_main_close);
	$("#main_right").click(menu_main_right);
	$("#main_left").click(menu_main_left);
}

