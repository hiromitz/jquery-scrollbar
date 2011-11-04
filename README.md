# Custome (Simple) Scrollbar plugin for jQuery

Add custom scrollbar to elements. Plugin that works with jQuery.

(additionally [jQuery Mouse Wheel plugin](https://github.com/brandonaaron/jquery-mousewheel) for mousewheel action.)

### usage:

simply,

    $('#element').scrollbar(options);

update scrollbar when element changed,

	$('#element').scrollbar('update');

### options

* **axis** *string*<br />
  horizontal or vertical scroll direction. x | y
* **wheel** *boolean*<br />
  scroll step on mousewheel
* **animate** *boolean*<br />
  animation on scroll
* **fade** *boolean*<br />
  fade in / out scrollbar on hover
* **prefix** *string*<br />
  css class prefix