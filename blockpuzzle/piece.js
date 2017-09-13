function Piece(pieceType) {

	var type;
	this.blocks = [];


	// Set piece type
	if(pieceType && pieceType > 0 || pieceType == 0) {
		type = pieceType;
	} else {
		var numTypes = Object.keys(PieceTypes).length;
		type = Math.floor(Math.random() * numTypes);
	}
	

	// Create piece
	switch(type) {
		case PieceTypes.PIECE1x1:
			this.blocks[0] = new Block(0, 0);
			break;
		case PieceTypes.PIECE1x2:
			this.blocks[0] = new Block(0, 0);
			this.blocks[1] = new Block(0, 1);
			break;
		case PieceTypes.PIECE1x3:
			this.blocks[0] = new Block(0, -1);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(0, 1);
			break;
		case PieceTypes.PIECE1x4:
			this.blocks[0] = new Block(0, -1);
        	this.blocks[1] = new Block(0, 0);
        	this.blocks[2] = new Block(0, 1);
        	this.blocks[3] = new Block(0, 2);
			break;
		case PieceTypes.PIECE1x5:
			this.blocks[0] = new Block(0, -2);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
	        this.blocks[4] = new Block(0, 2);
			break;
		case PieceTypes.PIECE2x1:
			this.blocks[0] = new Block(0, 0);
        	this.blocks[1] = new Block(1, 0);
			break;
		case PieceTypes.PIECE2x2:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(1, 1);
			break;
		case PieceTypes.PIECE3x1:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(1, 0);
			break;
		case PieceTypes.PIECE3x3:
			this.blocks[0] = new Block(-1, -1);
	        this.blocks[1] = new Block(-1, 0);
	        this.blocks[2] = new Block(-1, 1);
	        this.blocks[3] = new Block(0, -1);
	        this.blocks[4] = new Block(0, 0);
	        this.blocks[5] = new Block(0, 1);
	        this.blocks[6] = new Block(1, -1);
	        this.blocks[7] = new Block(1, 0);
	        this.blocks[8] = new Block(1, 1);
			break;
		case PieceTypes.PIECE4x1:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(2, 0);
			break;
		case PieceTypes.PIECESmallL:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
			break;
		case PieceTypes.PIECEBigL:
			this.blocks[0] = new Block(0, -2);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(1, 0);
	        this.blocks[4] = new Block(2, 0);
			break;
		case PieceTypes.PIECEHorJ:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, 0);
	        this.blocks[2] = new Block(0, 1);
	        this.blocks[3] = new Block(0, 2);
			break;
		case PieceTypes.PIECEs:
			this.blocks[0] = new Block(1, -1);
	        this.blocks[1] = new Block(1, 0);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
			break;
		case PieceTypes.PIECEt:
			this.blocks[0] = new Block(-1, 0);
	        this.blocks[1] = new Block(0, -1);
	        this.blocks[2] = new Block(0, 0);
	        this.blocks[3] = new Block(0, 1);
			break;
		case PieceTypes.PIECEVertJ:
			this.blocks[0] = new Block(0, 0);
	        this.blocks[1] = new Block(0, 1);
	        this.blocks[2] = new Block(1, 0);
	        this.blocks[3] = new Block(2, 0);
			break;
	}
}
