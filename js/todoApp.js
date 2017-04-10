var todoApp = angular.module('todoApp', ["html5.sortable"]);

todoApp.controller('MainController', ['$log', function($log) {
	var self = this;
	self.todoLists = [
		{
			listId: 678,
			listName: "How to use",
			listItems: [
				{ id: 1, order: 1, taskName: 'Click on "New List" to add a list', done: false },
				{ id: 2, order: 2, taskName: 'Click on the + icon to add tasks', done: false },
				{ id: 3, order: 3, taskName: 'Click on the pencil icon to edit the name', done: false },
				{ id: 4, order: 4, taskName: 'Or click on the names directly', done: false },
				{ id: 5, order: 5, taskName: 'To stop editing names, press Enter or Esc', done: false },
				{ id: 6, order: 6, taskName: 'or click on the pencil again, ', done: false },
				{ id: 7, order: 7, taskName: 'or anywhere outside the input field', done: false },
				{ id: 8, order: 8, taskName: 'To drag, click on the pin', done: false }
			]
		},
		{
			listId: 123,
			listName: "Todo",
			listItems: [
				{ id: 4, order: 10, taskName: 'Implement the back end', done: false },
				{ id: 5, order: 20, taskName: 'Add delete confirmation dialogue boxes', done: false },
				{ id: 6, order: 30, taskName: 'Get to the chopper', done: false }
			]
		}
	];

	self.sortableOptions = {
		handle:'.todoItemDragHandle',
		stop: function(list) {
			self.reorderList(list);
		}
	};

	function List(listName)
	{
		this.listId = self.createUUID("todoList");
		this.listName = listName;
		this.listItems = [];
		this.editable = false;
	}

	function ListItem(listItem)
	{
		this.taskName = listItem.taskName;
		this.id = self.createUUID("todoItem");
		this.done = false;
		this.editable = false;
		this.order = listItem.order;
	}

	//
	//	Does a linear search of the todoLists by listId
	//	and returns the index if found, otherwise returns -1
	//
	function getListIndexById(listId)
	{
		var i, ii;
		for(i = 0, ii = self.todoLists.length; i < ii; i++)
		{
			if(self.todoLists[i].listId === listId)
				return i;
		}
		return -1;
	}

	self.createList = function()
	{
		var listName = "[New list " + (self.todoLists.length + 1) + "]";
		var list = new List(listName);
		self.todoLists.push(list);
	};

	self.deleteList = function(targetListId)
	{
		var targetListIndex = getListIndexById(targetListId);
		if(targetListIndex !== -1)
		{
			self.todoLists.splice(targetListIndex, 1);
		}
		else
		{
			$log.warn("Could not get list with id " + targetListId);
		}
	};

	self.addListItem = function(listId)
	{
		var listItemObject = {};
		listItemObject.taskName = "[New task ";
		var listItem = new ListItem(listItemObject);
		var targetListIndex = getListIndexById(listId);
		listItem.taskName += " " + self.todoLists[targetListIndex].listItems.length + "]";
		if(targetListIndex !== -1)
		{
			listItem.order = self.todoLists[targetListIndex].listItems.length;
			self.todoLists[targetListIndex].listItems.push(listItem);
		}
		else
		{
			$log.warn("Could not get list with id " + listId);
			return;
		}
		// $log.info(JSON.stringify(self.todoLists));
	};

	self.deleteListItem = function(listId, targetItemId)
	{
		var targetListIndex = getListIndexById(listId);
		var i, ii;
		if(targetListIndex !== -1)
		{
			var targetListItems = self.todoLists[targetListIndex].listItems;
			for(i = 0, ii = targetListItems.length; i < ii; i++)
			{
				if(targetListItems[i].id === targetItemId)
				{
					targetListItems.splice(i, 1);
					return;
				}
			}
		}
		else
		{
			$log.warn("Could not get list with id " + listId);
		}
	};

	self.reorderList = function(list)
	{
		for(var i = 0, ii = list.length; i < ii; i++)
			list[i].order = i;
	};

	self.enableEditingName = function(item)
	{
		item.editable = true;
	};

	self.disableEditingName = function(item)
	{
		item.editable = false;
	};

	self.createUUID = function(prefix)
	{
		return (prefix + '-xxxx-xxxx-xxxx-xxxx-xxxx').replace(/x/g, function (c)
		{
			var r, v, c;
			r = Math.random() * 16 | 0;
			v = (c === 'x') ? r : r & 0x3 | 0x8;
			return v.toString(16);
		});
	};

	self.toggleTaskStatus = function(taskId)
	{
		var i, ii, j, jj, todoItem;
		for(i = 0, ii = self.todoLists.length; i < ii; i++)
		{
			for(j = 0, jj = self.todoLists[i].listItems.length; j < jj; j++)
			{
				todoItem = self.todoLists[i].listItems[j];
				if(todoItem.id === taskId)
				{
					todoItem.done = !todoItem.done;
					break;
				}
			}
		}
	};

	self.clearIfDefault = function($event)
	{
		if($event.target.value.indexOf("[New") === 0)
			$event.target.value = "";
	};

}]);

todoApp.directive('focusElement', function () {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attrs) {
			$element[0].focus();
		}
	}
});

todoApp.directive('onEnterOrEscape', function () {
	return function ($scope, $element, $attrs) {
		$element.bind("keydown keypress", function (event) {
			if (event.which === 13 || event.which === 27) {
				$scope.$apply(function () {
					$scope.$eval($attrs.onEnterOrEscape);
				});
				event.preventDefault();
			}
		});
	};
});
