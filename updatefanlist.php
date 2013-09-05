 <?php

$id= $_POST["id"];

$fans = array();

// 기본 회원정보를 읽어들이고
$filename = "fans.txt"; 

$fp = fopen($filename,"r"); 
$line = "";

// 새롭게 추가하려는 회원이 이미 존재하는지 체크하고
$isExist = 0;
while(true) {
	$line = fgets($fp,1024);
	$line = trim($line);

	if($line==null)
		break;
	if(strcmp($line,$id)==0) {
		$isExist = 1;
	}
}
fclose($fp); 

// 파일로 쓰기
if($isExist==1) {
//	echo "hello again";
} 

// 유의미한 id값일 때에만 파일로 쓰기
if(($isExist==0)&&(strlen($id)>5)) {
	$fp = fopen($filename,"a"); 
	$str = $id."\n";
	fwrite($fp,$str); 
	fclose($fp); 
	chmod($filename,0777);
}

// 모든 팬들의 ID를 배열로 반환해주기 
$fanarray = array();

$fp = fopen($filename,"r"); 
$line = "";
while(true) {
	$line = fgets($fp,1024);
	$line = trim($line);
	if($line==null)
		break;
	array_push($fanarray,$line);
}
fclose($fp); 

echo json_encode($fanarray);

?>