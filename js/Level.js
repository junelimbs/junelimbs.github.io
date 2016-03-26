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
	this.createCards();
	//this.moveMonkey();
};

Level.prototype.createCards = function() {
	// create 5 cards
	this.cards = [];
	var card;
	for (var i = 0; i < 5; i++) {
		card = this.add.sprite(250 + i * 140, this.world.height - 350,
		"card"); 
		card.anchor.set(0.5, 0.5);

		// listen for a card click
		card.inputEnabled = true;
		card.events.onInputOver.add(this.cardMouseOver, this, 0, card);
		card.events.onInputOut.add(this.cardMouseOut, this, 0, card);
		card.customAttributes = {
				defaultY: this.world.height - 350
		};
		this.cards[i] = card;
	}
	
};

Level.prototype.cardMouseOver = function(card) {
	// stop all monkey's movements
	//this.tweens.removeAll();

	// rotate monkey
	var twn = this.add.tween(card.scale);
	twn.to({
		x: 1.1,
		y: 1.1,
	}, 200, "Linear", true);
	
	twn = this.add.tween(card.position);
	twn.to({
		x : card.position.x,
		y : card.customAttributes.defaultY - 50
	}, 200, "Linear", true);

	// when tween completes, quit the game
	//twn.onComplete.addOnce(this.quitGame, this);
};

Level.prototype.cardMouseOut = function(card) {
	// stop all monkey's movements
	//this.tweens.removeAll();

	// scale card
	twn = this.add.tween(card.scale);
	twn.to({
		x : 1.0,
		y : 1.0
	}, 200, "Linear", true);
	
	twn = this.add.tween(card.position);
	twn.to({
		x : card.position.x,
		y : card.customAttributes.defaultY
	}, 200, "Linear", true);

	// when tween completes, quit the game
	//twn.onComplete.addOnce(this.quitGame, this);
};

Level.prototype.update = function() {
	this.updateCardPositions();
};

Level.prototype.updateCardPositions = function() {
	var botMargin = this.world.height - 350;
	var deg = -30;
	for (var cardi in this.cards) {
		var card = this.cards[cardi];
		var count = this.cards.length;
		card.angle = deg;
		deg += 15;
		card.bringToTop();
	}
};

Level.prototype.quitGame = function() {
	this.game.state.start("Menu");
};