<?php 
	
	if(!function_exists('format_date')){
		/**
		 * @param $date de type Carbon
		 * @return date formatée
		 */
		function format_date(Carbon\Carbon $date){
			return $date->format('y-m-d H:i');
		}
	}	
	
?>