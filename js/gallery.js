// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// Counter for the mImages array
var mCurrentIndex = 0;

// Array holding GalleryImage objects (see below).
var mImages = [];

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
//if ($.get('localhost', 'json')) {
//	var mUrl = $.get('localhost', 'json');
//}
//else {
	var mUrl = 'images.json';
//}

function swapPhoto() {
	//Add code here to access the #slideShow element.
	var currSlide = $("#photo");
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
	mCurrentIndex++;
	if (mCurrentIndex == mImages.length) {
		mCurrentIndex = 0;
	}
	$(currSlide).fadeOut(500, function () {
		currSlide.attr('src', mImages[mCurrentIndex].imgPath).fadeIn(500);
	});
	
	$('.location').text('Location: ' + mImages[mCurrentIndex].imgLocation);
	$('.description').text('Description: ' + mImages[mCurrentIndex].description);
	$('.date').text('Date: ' + mImages[mCurrentIndex].date);
	
}



// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();
mRequest.open("GET", mUrl);

mRequest.onreadystatechange = function() {
        if (mRequest.readyState == 4 && mRequest.status == 200) {
            //console.log(‘responseText:’ + mRequest.responseText); // This helps you check if the JSON is input
            try {
                mJson = JSON.parse(mRequest.responseText); // This converts the JSON object into a JS object.

               // this for loop makes sure to go through each image in the JSON file
                for (var i = 0; i < mJson.images.length; i++) {
	                
                               // create a temporary variable holding all the image data for one line
		        	var myLine = mJson.images[i];
                              // add a new GalleryImage object into the mImages array which is defined outside this function.
		        	mImages.push(new GalleryImage(myLine.imgPath, myLine.imgLocation, myLine.description, myLine.date));
		        	
		        	//console.log(mImages)
		    	}

            } catch(err) {
               // this code runs if there’s an error parsing the JSON data. 
                console.log(err.message + " in " + mRequest.responseText);
                return;
            }
        }
    };

mRequest.send();



//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	
	// This initially hides the photos' metadata information
	$('.details').eq(0).hide();
	$('.moreIndicator').click( function() {
		
		if ($(this).hasClass('rot270')) {
			$(this).removeClass('rot270');
			$(this).addClass('rot90');
			$('.details').eq(0).hide(800);
		}
		else {
			$(this).removeClass('rot90');
			$(this).addClass('rot270');
			$('.details').eq(0).show(800);
		}

	});

	$('#nextPhoto').offset({left: 690 });
	
	$('#nextPhoto').click( function() {
			mLastFrameTime = 0;
			swapPhoto();
	});

	$('#prevPhoto').click( function() {
			mLastFrameTime = 0;
			

			if(mCurrentIndex == 0) {
				mCurrentIndex = mImages.length -2;
			}
			else {
				mCurrentIndex = mCurrentIndex -2;
				if (mCurrentIndex < 0) {
					mCurrentIndex = -1;
				}
			}
			swapPhoto();
	});
});

window.addEventListener('load', function() {
	
	console.log('window loaded');

}, false);

function GalleryImage(path, location, description, date) {
	this.imgPath = path;
	this.imgLocation = location;
	this.description = description;
	this.date = date;
}