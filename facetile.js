//// 페이스북 API 초기화 부분. -- 시작 
// appId 와 channelUrl 만 새로채워주면 됨. 
// 그 다음 제가 만들어놓은 channelUrl 파일 그냥 복사해서 해당 위치에 떨꿔놓으면 끝.
window.fbAsyncInit = function() {
	FB.init({
		appId      : '000000000000000', // App ID
		channelUrl : 'channel.php', // Channel File
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});
	
	findpPic();

};
// Load the SDK asynchronously
(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/all.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
//// 페이스북 API 초기화 부분. -- 끝


//// isotope 초기화 	
$(function(){
	var $container = $('#container');
	
	$container.isotope({
		itemSelector: '.element',
		animationEngine: 'best-available'
	});
});		
		   
var user = {}; // 허가받은 유저의 정보를 받아놓을 객체
var fanarray = []; // 팬들의 fb_id들을 가져올 배열

function findpPic()
{ 
	//// 사진들을 불러오기 전에 컨테이너 초기화 작업을 수행한다.
	// isotope기능을 비활성화시킨 후 
	$("#container").isotope( 'destroy' );
	// 내부 아이템을 비운다.
	$("#container").html("");
	
	
	FB.getLoginStatus(function(response) {
		// 페북에 로그인 및 앱허가가 되어있다면 자신의 페북아이디를 담아 등록 & 팬목록 요청을 보낸다.
		if (response.status === 'connected') {
		    FB.api('/me', function(response) {		
			    if(response.id) {
					user.id = response.id;
					updateFanList(); // ajax로 팬 DB 업데이트 요청을 한다.
				} else {
				}
		    });		
		} else { // 사용자의 페북정보에 대한 권한이 아직 없다면 00으로 id값을 초기화 한 후  팬 목록을 요청한다.
			user.id = "00";
			updateFanList(); // ajax로 팬 DB 업데이트 요청을 한다.
		}
	});
};

function updateFanList() {
	$.ajax({
		type: "POST",
		url: "updatefanlist.php",
		data: "id="+user.id,
		dataType:"text",
        success : function(data) {	
   	    	console.log(data);
        	fanarray = JSON.parse(data);	

        	var itemsString = getTileStrings(fanarray,80,96);
			var $newItems = $(itemsString);      
			$('#container').append( $newItems ).isotope( 'addItems', $newItems ).isotope({ sortBy: 'random' });
   		}
	});
}

// 페북아이디 배열과, 만들 div의 수, 그리고 페북에서가져올 프로필사진의 픽셀사이즈(정사각형)를 인자로 받는다.
function getTileStrings(fanarray,numberOfResultItems,sizeOfSource) {
	var itemsString = "";
	var count = 0;
	while(1) {
		for(var i=0;i<fanarray.length;i++) {
			itemsString = itemsString + '<div class="element"><img src="https://graph.facebook.com/'+fanarray[i]+'/picture?width='+sizeOfSource+'&height='+sizeOfSource+'\"/></div>';   
			count++;
			if(count==numberOfResultItems)
				break;
		}  
		if(count==numberOfResultItems)
			break;
	}
	return itemsString;   		
}