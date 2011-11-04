# Custome (Simple) Scrollbar plugin for jQuery

Add custom scrollbar to elements. Plugin that works with jQuery.
(additionally [jQuery Mouse Wheel plugin](https://github.com/brandonaaron/jquery-mousewheel) for mousewheel action.)

### usage:

simply

    $('#element').scrollbar(options);

when element changed,

	$('#element').scrollbar('update');

### options

* axis string
  horizontal or vertical scroll direction. x | y
* wheel boolean
  scroll step on mousewheel
* animate boolean
  animation on scroll
* fade boolean
  fade in / out scrollbar on hover
* prefix
  css class prefix