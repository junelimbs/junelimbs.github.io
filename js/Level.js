/**
 * Level state.
 */
function Level() {
	Phaser.State.call(this);
}

/** @type Phaser.State */
var proto = Object.create(Phaser.State);
Level.prototype = proto;

Level.prototype.create = function() {
	this.putTableTexture();
	this.createCards();
	this.game.input.addMoveCallback(this.mouseMoveHandle, this);
	//this.moveMonkey();
};

Level.prototype.putTableTexture = function() {
	this.wallpaper = this.add.image(0,0,"wp");
	this.wallpaper.height = this.game.height;
	this.wallpaper.width = this.game.width;
};

Level.prototype.createCards = function() {
	// create 5 cards
	this.cards = [];
	var card;
	for (var i = 0; i < 5; i++) {
		var startXPos = 330 + i * 120;
		var startYPos = this.world.height - 180;
		card = this.add.sprite(startXPos, startYPos,
		"card"); 
		card.anchor.set(0.5, 0.5);

		// listen for a card click
		card.inputEnabled = true;
		card.input.enableDrag();
		card.events.onInputOver.add(this.cardMouseOver, this, 0, card);
		card.events.onInputOut.add(this.cardMouseOut, this, 0, card);
		card.events.onInputDown.add(this.cardMouseDown, this, 0, card);
		card.events.onInputUp.add(this.cardMouseUp, this, 0, card);
		card.events.onDragStart.add(this.cardDragStart, this, 0, card);
		card.events.onDragStop.add(this.cardDragStop, this, 0, card);
		card.customAttributes = {
				defaultX: startXPos,
				defaultY: startYPos
		};
		this.cards[i] = card;
	}
	this.updateCardPositions();
};

Level.prototype.cardMouseOver = function(card) {
	// stop all monkey's movements
	//this.tweens.removeAll();

	// rotate monkey
	var twn = this.add.tween(card.scale);
	twn.to({
		x: 1.2,
		y: 1.2,
	}, 150, "Cubic", true);
	
	twn = this.add.tween(card);
	twn.to({
		angle: 0
	}, 150, "Cubic", true);
	
	twn = this.add.tween(card.position);
	twn.to({
		x : card.customAttributes.defaultX,
		y : card.customAttributes.defaultY - 50
	}, 150, "Cubic", true);
	card.bringToTop();
	
	// when tween completes, quit the game
	//twn.onComplete.addOnce(this.quitGame, this);
};

Level.prototype.cardMouseOut = function(card) {
	// stop all monkey's movements
	//this.tweens.removeAll();
	
	this.rearrange();
	

	// scale card
	var twn = this.add.tween(card.scale);
	twn.to({
		x : 1.0,
		y : 1.0
	}, 150, "Linear", true);
	
	twn = this.add.tween(card);
	twn.to({
		angle: this.getAngleForCard(card)
	}, 150, "Linear", true);
	
	twn = this.add.tween(card.position);
	twn.to({
		x : card.customAttributes.defaultX,
		y : card.customAttributes.defaultY
	}, 150, "Linear", true);

	// when tween completes, quit the game
	//twn.onComplete.addOnce(this.updateCardPosition, this, 0, card);
};

Level.prototype.cardMouseDown = function(card) {
//	this.draggedCard = card;
//	console.log("started gradding card");
};

Level.prototype.cardMouseUp = function(card) {
//	this.draggedCard = null;
//	this.cardMouseOut(card);
//	console.log("released card");
};

Level.prototype.cardDragStart = function(card) {
	this.draggedCard = card;
	this.cardMouseOver(card);
	console.log("started dragging card");
};

Level.prototype.cardDragStop = function(card) {
	this.draggedCard = null;
	if (card.position.y < 200) {
		twn = this.add.tween(card);
		twn.to({
			alpha: 0,
		}, 200, "Power3", true);
	} else {
		this.cardMouseOut(card);		
	}
	console.log("stopped dragging card");
};

Level.prototype.update = function() {
	//this.updateCardPositions();
};

Level.prototype.rearrange = function() {
	for (var cardi in this.cards) {
		var card = this.cards[cardi];
		card.bringToTop();
	}
};

Level.prototype.updateCardPositions = function() {
	for (var cardi in this.cards) {
		var card = this.cards[cardi];
			card.angle = this.getAngleForCard(card);
	}
};

Level.prototype.getAngleForCard = function(targetCard) { 
	var deg = -24;
	for (var cardi in this.cards) {
		var card = this.cards[cardi];
		if (targetCard === card) {
			return deg;
		}
		deg += 12;
		//card.bringToTop();
	}
	return deg;
};

Level.prototype.updateCardPosition = function(point, tween, targetCard) {
	console.log(targetCard); 	
};

Level.prototype.mouseMoveHandle = function(pointer, x, y, downState) {
	//if (typeof(this.draggedCard) != "undefined" && ) {
	if (this.draggedCard) {
		var card = this.draggedCard;
		card.scale.x = 1.3;
		card.scale.y = 1.3;
	}
};

Level.prototype.quitGame = function() {
	this.game.state.start("Menu");
};