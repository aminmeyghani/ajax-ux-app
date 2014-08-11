jQuery(document).ready(function () {

	// HIDE BROWSER BAR ON LOAD
	window.addEventListener("load",function() {
		setTimeout(function(){
		  window.scrollTo(0, 1);
	    }, 0);
	});
	

	// LIGHTEN/DARKEN HEX COLOR - http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color
	function LightenDarkenColor(color, percent) {
	 
	    var num = parseInt(color,16),
	    	amt = Math.round(2.55 * percent),
	    	R 	= (num >> 16) + amt,
	    	B 	= (num >> 8 & 0x00FF) + amt,
	    	G 	= (num & 0x0000FF) + amt;
	    
	    return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
	    
	}
	
	
	
	jQuery( function() {
		
		var Color, 
			regColorcode, 
			el, 
			newPoint, 
			newPlace, 
			offset, 
			strLength, 
			shade,
			range,
			rangeLabel,
			newColors;
			
		
		// validate hex string on keyup
		// resource : http://networking.mydesigntool.com/viewtopic.php?tid=415&id=31
		$("#color").keyup(function() {
			
			Color 			= $("#color").val();
			regColorcode 	= /^([0-9a-fA-F]{6})?$/;
			
			if(regColorcode.test(Color) == false) {
	
				$(".error_message").text("Color code is not yet valid.");
			
			} else {
	
				$(".error_message").text("Color code is valid!"); 
	
			}
	
		}); // end keyup function
		
		
		// Select all range inputs, watch for change
		$("input[type='range']").change(function() {
	
			el = $(this);
			width = el.width();
	
			el
			.next("output")
			.text(el.val() + '%');
		})
		.trigger('change');
		
		
		
		// reset form and color swatches
		$("#reset").click(function() {
			
			$("#temp_colors").remove();
			$("#new_colors").html("");
			
		});
		
		// prevent the submit button from reloading the page
		$('#hexColorTool').submit(function () {
		
			return false;
			
		});
		
		
		$('#color').keydown(function(event){    
			if(event.keyCode==13){
			
				$('#submit').trigger('click');
			}
		});
		
		
		
		
		
		// submit click function
		$("#submit").click(function() {
		
			$("#temp_colors").remove();
				
			Color 		= $("#color").val(); // get color input value
			strLength 	= Color.length; // get string length
			shade 		= $("input:radio:checked").val(); // get lighten/darken input value
			range		= $("#range").val();
			label		= "ORIGINAL";
			inc			= "";
			
			function hexToRgb(hex) {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}
			
			if ( shade == 'darken' ) {
				plusMinus 	= "-";
			} else {
				plusMinus 	= "";
			}
			
			// create the lighten array
			NewColors = [
				LightenDarkenColor(Color, 0),
				LightenDarkenColor(Color, plusMinus + range*1),
				LightenDarkenColor(Color, plusMinus + range*2),
				LightenDarkenColor(Color, plusMinus + range*3),
				LightenDarkenColor(Color, plusMinus + range*4),
				LightenDarkenColor(Color, plusMinus + range*5)
			];
			
			// if hex has 6 characters
			if ( ( strLength == 6 ) ) {
					
				// for each NewColors
				$.each( NewColors, function(i, val) {
					
					// create a new element
					var div = document.createElement("div");
					
					// if we hit pure white
					if ( (val == '000000') || (val == 'FFFFFF') || (val == 'ffffff') )  {
						
						// add HTML, CSS and N/A swatches 
						$(div).addClass("clr")
							  .appendTo("#new_colors");
					
					// otherwise carry on
					} else {
					
						r = hexToRgb("#" + val).r;
						g = hexToRgb("#" + val).g;
						b = hexToRgb("#" + val).b;
						
						// add HTML, CSS and normal swatches 
						$(div).addClass("color col span_2")
							  .append("<div class='swatch' style='background-color: #" + val +";'></div>")
							  .append("<div class='info'><span class='label'><strong>HTML:</strong>#" + val.toUpperCase() +"</span><span class='label'><strong>RGB:</strong>" + r + "&nbsp;&nbsp;" + g + "&nbsp;&nbsp;" + b + "</span><span class='label'><strong>" + label + "</strong>" + inc + "</span></div>")
							  .appendTo("#new_colors");
						
					} // end if pure white or not
					
					if ( shade == 'darken' ) {
						label		= "DARKENED:";
					} else {
						label		= "LIGHTENED:";
					}
					
					inc = range * (i + 1) + "%";
					
				}); // end for each NewColors
				
				var div = document.createElement("div");
				$(div).addClass("row seperator")
					  .appendTo("#new_colors");
			  
			} // end if hex has 6 characters
			
		}); // end submit click function
		
	}); // end anonymous function

});