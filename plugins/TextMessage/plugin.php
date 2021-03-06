<?php
//Include the base class for plugins.
include_once("Plugin.php");

class TextMessage extends Plugin {
	/**
	 * This is where the required parameters are specified with calls to
	 * createParameter.
	**/
	protected function specifyParameters() {
		$this->createParameter("text", "Message", "The text you want to display", Type::LongText);
	}

	/**
	 * Composes the html, javascript and css for the view using the preloaded
	 * parameters. These should be bundeled using bundleView and returned.
	**/
	public function getViews() {
		$text = $this->readParameter("text");
		
		//Generate a HTML string
		$html = "<p>$text</p>";
		
		$title = "Text message";
		
		$this->bundleView($title, time(), $html);
	}
}

?>