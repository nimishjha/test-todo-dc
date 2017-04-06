angular.module('todoApp', []).controller('MainController', [function() {
//
//	Begin controller
//
	var self = this;
	self.todoLists = [
		{
			listId: 678,
			listName: "List One",
			listItems: [
				{ id: 1, order: 1, taskName: 'Buy groceries', done: false },
				{ id: 2, order: 2, taskName: 'Go to Mars', done: false },
				{ id: 3, order: 3, taskName: 'Walk the dog', done: false }
			]
		},
		{
			listId: 123,
			listName: "List Two",
			listItems: [
				{ id: 4, order: 10, taskName: 'Play DOOM', done: false },
				{ id: 5, order: 20, taskName: 'Read a book', done: false },
				{ id: 6, order: 30, taskName: 'Get to the chopper', done: false }
			]
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
		var listName = prompt("Listname");
		if(!listName.length)
			return;
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
		listItemObject.taskName = prompt("taskName");
		listItemObject.order = Number(prompt("order"));

		if(!(listItemObject.order && listItemObject.taskName))
		{
			console.warn("listItem is missing essential properties; order is " + listItemObject.order + " and taskName is " + listItemObject.taskName);
			return;
		}
		var listItem = new ListItem(listItemObject);
		var targetListIndex = getListIndexById(listId);
		if(targetListIndex !== -1)
		{
			self.todoLists[targetListIndex].listItems.push(listItem);
		}
		else
		{
			console.warn("Could not get list with id " + listId);
		}
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
}]);
