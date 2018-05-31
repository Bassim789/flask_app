<?php
require_once realpath('../php/config_public.php');
only_user_logged();

function get_page_data(){
	$data = [
		'name' => 'bassim', 
		'age' => 28,
		'categories' => get_categories(),
		'actions' => get_actions(),
	];
	return $data;
}
function get_categories(){
	return Db::getAll('todo_category', 'WHERE user_id = '.$_SESSION['user_id']);
}
function get_actions(){
	$actions = Db::getAll('todo_action', 'WHERE user_id = '.$_SESSION['user_id']);
	$categories_data = get_categories();
	$categories = [];
	foreach ($categories_data as $i => $category_data){
		$categories[$category_data['id']] = $category_data;
	}
	foreach ($actions as $i => $action){
		$category = 'error no category id: '.$action['category_id'];
		if(isset($categories[$action['category_id']])){
			$category = $categories[$action['category_id']]['name'];
		}
		$actions[$i]['time_todo_hour'] = floor($action['time_todo'] / 60);
		$actions[$i]['time_todo_minute'] =  $action['time_todo'] % 60; 
		$actions[$i]['time_done_hour'] = floor($action['time_done'] / 60);
		$actions[$i]['time_done_minute'] = $action['time_done'] % 60;
		$actions[$i]['category'] = $category;
	}
	return $actions;
}

if(action('get_categories')){
	send(['categories' => get_categories()]);
}
if(action('add_category')){
	Db::insert('todo_category', [
		'name' => $_POST['name'],
		'detail' => $_POST['detail'],
		'user_id' => $_SESSION['user_id']]);
	send(['res' => 'ok']);
}
if(action('add_action')){
	$time_todo_hour = $_POST['time_todo_hour'] == '' ? 0 : $_POST['time_todo_hour'];
	$time_todo_minute = $_POST['time_todo_minute'] == '' ? 0 : $_POST['time_todo_minute'];
	$time_todo = $time_todo_minute + $time_todo_hour * 60;
	Db::insert('todo_action', [
		'name' => $_POST['name'],
		'detail' => $_POST['detail'],
		'user_id' => $_SESSION['user_id'],
		'category_id' => $_POST['category_id'],
		'time_todo' => $time_todo]);
	Db::update('todo_category', ['nb_elem' => 'nb_elem + 1'], 'id', $_POST['category_id']);
	send(['res' => 'ok']);
}
if(action('remove_action')){
	$action = Db::get('todo_action', 
		'id', $_POST['action_id'], 
		'AND user_id = '.$_SESSION['user_id']);
	Db::delete('todo_action', 'id', $action['id']);
	Db::update('todo_category', ['nb_elem' => 'nb_elem - 1'], 'id', $action['category_id']);
	send(['res' => 'ok']);
}
if (action('update_time_done')){
	$time_done_hour = $_POST['time_done_hour'] == '' ? 0 : $_POST['time_done_hour'];
	$time_done_minute = $_POST['time_done_minute'] == '' ? 0 : $_POST['time_done_minute'];
	$time_done = $time_done_minute + $time_done_hour * 60;
	Db::update('todo_action',
		['time_done' => $time_done], 
		'id', $_POST['action_id'],
		'AND user_id = '.$_SESSION['user_id']);
	send(['res' => 'ok']);
}
if(action('remove_category')){
	$category = Db::get('todo_category', 
		'id', $_POST['category_id'], 
		'AND user_id = '.$_SESSION['user_id']);
	Db::delete('todo_category', 'id', $category['id']);
	send(['res' => 'ok']);
}
