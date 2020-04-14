/**
 * Automatically select photos on [Google Photos](https://photos.google.com/).
 *
 * @author Ddorda <https://ddorda.net>
 * @see	https://ddorda.net/archives/1872 
 *
 * @param {number}                    [limit=1500]       Selection limit. Maximum is 1500 (limited by Google).
 * @param {('photos'|'videos'|'any')} [selectType='any'] Limit selection to a specific type.
**/

async function selectPhotos(limit, selectType)
{

	var scroller = document.getElementsByTagName('c-wiz')[2]
	var counter = 0;
	var filterFunction;


	if (limit == undefined || limit > 1500) {
		console.log("Please notice maximum selection is limited by Google to 1500 photos.")
		limit = 1500;
	}

	switch (selectType) {
		case 'photos':
			filterFunction = function(it){return it.getAttribute('aria-label').startsWith('Photo') == true;}
			break;
		case 'videos':
			filterFunction = function(it){return it.getAttribute('aria-label').startsWith('Video') == true;}
			break;
		default:
			selectType = 'any';
			filterFunction = function(it){return it.getAttribute('aria-label').startsWith('Select') == false;}
	}


	while (true)
	{
		var maxTries = 10;
		var items;
		var lastItem;
		for (var tries=1;tries<=maxTries;tries++){
			items = Array.from(document.querySelectorAll('div[role=checkbox][aria-checked=false]'));
			if (items.length != 0) { 
				lastItem = items[items.length-1];
				items = items.filter(filterFunction);
				break;
			}
			if (tries == maxTries) { throw "no items could found! Please check your network connection."; }
			await new Promise(done => setTimeout(() => done(), 500)); 
		}
		for (var i=0;i<items.length;i++){if (counter < limit){items[i].click();counter++;} }
		if (counter >= limit) {break; }

		scroller.scrollTo(0,scroller.scrollTop+lastItem.getBoundingClientRect().top);
		await new Promise(done => setTimeout(() => done(), 500)); 
	}
}