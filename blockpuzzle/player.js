function Player(id) {
	this.id = 0;
	this.xp = 0;
	this.piece = new Piece();

	if(id) { this.id = id; }
}
