angular.module('todoApp', []).controller('MainController', [function() {
//
//	Begin controller
//
	var self = this;
	self.getNewListName = false;
	self.todoLists = [
		{
			listId: 678,
			listName: "List One",
			listItems: [
				{ id: 1, order: 1, taskName: 'Buy groceries', done: false },
				{ id: 2, order: 2, taskName: 'Go to Mars', done: false },
				{ id: 3, order: 3, taskName: 'Walk the dog', done: false }
			],
			editable: false
		},
		{
			listId: 123,
			listName: "List Two",
			listItems: [
				{ id: 4, order: 10, taskName: 'Read a book', done: false },
				{ id: 5, order: 20, taskName: 'Check out some new music', done: false },
				{ id: 6, order: 30, taskName: 'Get to the chopper', done: false }
			],
			editable: false
		}
	];

	//
	//	List constructor
	//
	function List(listName)
	{
		this.listId = self.createUUID("todoList");
		this.listName = listName;
		this.listItems = [];
		this.editable = false;
	}

	//
	//	ListItem constructor
	//
	function ListItem(listItem)
	{
		this.order = listItem.order;
		this.taskName = listItem.taskName;
		this.id = self.createUUID("todoItem");
		this.done = false;
		this.editable = false;
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
		var listName = "New list";
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
			console.warn("Could not get list with id " + targetListId);
		}
	};

	self.addListItem = function(listId)
	{
		var listItemObject = {};
		var targetListIndex = getListIndexById(listId);
		if(targetListIndex !== -1)
		{
			listItemObject.order = self.todoLists[targetListIndex].listItems.length;
		}
		else
		{
			console.warn("Could not get list with id " + listId);
			return;
		}
		listItemObject.taskName = "New task";

		if(!(typeof(listItemObject.order) === "number" && listItemObject.taskName))
		{
			console.warn("listItem is missing essential properties; order is " + listItemObject.order + " and taskName is " + listItemObject.taskName);
			return;
		}
		var listItem = new ListItem(listItemObject);
		self.todoLists[targetListIndex].listItems.push(listItem);
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
			console.warn("Could not get list with id " + listId);
		}
	};

	self.toggleEditingName = function(item)
	{
		item.editable = !item.editable;
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

//
//	End controller
//
}]).directive('focusElement', function () {
	return {
		restrict: 'A',
		link: function ($scope, $element, $attrs) {
			$element[0].focus();
		}
	}
}).directive('onKeypressEnter', function () {
	return function ($scope, $element, $attrs) {
		$element.bind("keydown keypress", function (event) {
			if (event.which === 13) {
				$scope.$apply(function () {
					$scope.$eval($attrs.onKeypressEnter);
				});
				event.preventDefault();
			}
		});
	};
});
