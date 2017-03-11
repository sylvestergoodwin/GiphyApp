

giphyBaseURL = 'http://api.giphy.com/v1/gifs/search?q=';
giphyKey = '&api_key=dc6zaTOxFJmzC';
giphyLimit = 'limit=';  

var buttonArray = []
									

function buttonData(buttonID, srchStr, srchCat, cnt, buttonObj)
{
	this.buttonID = buttonID;
	this.searchString = srchStr;
	this.searchCategory = srchCat;
	this.imageCount = cnt;
	this.resultSet = [{url: '',
										 gif: '',
										 height: 0,
										 width: 0,
										 rating: '',
										 currentState: ''}];
	this.giphyButton = buttonObj;
}									
									
function doButton(giphyCat, giphyText, giphyCount)
{
	$("#giphy-button-list").html("<p> </p>");
		
	var giphyIndex = buttonArray.length;
	var buttonMeThis = $("<button>")
											.addClass("giphy-button");
											buttonMeThis.attr("button-id",giphyIndex);
											buttonMeThis.text(giphyText+'['+giphyCount+']') 
											;
											
	var buttn = new buttonData(giphyIndex, giphyText, giphyCat, giphyCount, buttonMeThis);
	
	buttonArray.push(buttn);
	
	giphyDo()
}
									
function defaultButtons()
{
	doButton('Anime', 'Lord Sesshomaru', 10);
	doButton('Cartoon', 'garfield', 5);
	doButton('Island', 'Beach', 15);
	doButton('Olympic', 'sprinter', 8);
	doButton('DC', 'batman', 12);
	
}

function toggleGif()
{ 
	var gifIndex = $(this).attr("data-index");
	
	var pictureMe ='';
	var currentState = $("#giphy-image-"+gifIndex).attr("data-state");
	if (currentState == "still-data") 
	{
		currentState = "moving-pictures";
		pictureMe = $("#giphy-image-"+gifIndex).attr("data-gif-url");
	}
	else
	{
		currentState = "still-data";
		pictureMe = $("#giphy-image-"+gifIndex).attr("data-still-url");
	}
	
	$("#giphy-image-"+gifIndex).attr("data-state", currentState);
	$("#giphy-image-"+gifIndex).attr("src", pictureMe);
}

function giphyDo()
{
	$("#giphy-button-list").empty()
	for(var i=0; i < buttonArray.length; i++)
	{
		$("#giphy-button-list").append(buttonArray[i].giphyButton);	
	}
}

function getMeMyGif()
{
	$("#giphy-gifs").empty();
	var buttonIndex = $(this).attr("button-id");
	var gyphySearch = giphyBaseURL 
										+ encodeURIComponent(buttonArray[buttonIndex].searchCategory +' '
										+ buttonArray[buttonIndex].searchString) +'&'
										+ giphyLimit+buttonArray[buttonIndex].imageCount
										+ giphyKey;
	
	$.ajax({
		      url: gyphySearch,
					method: "GET"}).done(function(gyphyResponse){
															 var resultSet ={url: '',
																		 gif: '',
																		 height: 0,
																		 width: 0,
																		 rating: '',
																		 currentState: ''};
															 for(var i=0; i < gyphyResponse.data.length; i++)
															 {
																 resultSet.url = gyphyResponse.data[i].images.original_still.url;//fixed_width.url;
																 resultSet.gif = gyphyResponse.data[i].images.fixed_width.url;
																 resultSet.height = gyphyResponse.data[i].images.fixed_width.height;
																 resultSet.width = gyphyResponse.data[i].images.fixed_width.width;
																 resultSet.rating = gyphyResponse.data[i].rating;
                                 resultSet.currentState = "still-data";
                                 
																 buttonArray[buttonIndex].resultSet.push(resultSet);
																 
																 imageDump = $("<img>");
																 imageDump.attr("id", "giphy-image-"+i);
																 imageDump.attr("src", resultSet.url);
																 imageDump.attr("width", resultSet.width);
																 imageDump.attr("height",resultSet.height);
																 imageDump.attr("data-still-url",resultSet.url);
																 imageDump.attr("data-gif-url", resultSet.gif);
																 imageDump.attr("data-state",resultSet.currentState);
																 
																 imageFrame = $("<div>");
																 imageFrame.attr("id","giphy-image-frame-"+i);
																 imageFrame.attr("data-index",i);
																 imageFrame.addClass("giphy-image-frame-class");
																 imageFrame.html("<h3> Rating = "+resultSet.rating.toUpperCase()+"</h3>")
																 
																 imageFrame.append(imageDump);
																 
																 $("#giphy-gifs").append(imageFrame)
															 }
															 
					});
}
function doTheGiphy()
{
	$(document).on("click", ".giphy-button", getMeMyGif);
  $(document).on("click", ".giphy-image-frame-class", toggleGif);
	
	defaultButtons();
	
	$("#giphy-do").on("click", function (event)
		{
			// halt submission of form
			event.preventDefault();
						
			var giphyText = $("#giphy-search-input").val();
			var giphyCount = $("#giphy-search-input-image-count").val();
			var giphyCategory = $("#giphy-search-category").val();
			
			doButton(giphyCategory,giphyText, giphyCount);
		});
	
	
}