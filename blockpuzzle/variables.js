var PieceTypes = Object.freeze({PIECE1x1: 0, PIECE1x2: 1, PIECE1x3: 2, PIECE1x4: 3, PIECE1x5: 4, PIECE2x1: 5,
                                PIECE2x2: 6, PIECE3x1: 7, PIECE3x3: 8, PIECE4x1: 9, PIECESmallL: 10, PIECEBigL: 11,
                                PIECEHorJ: 12, PIECEs: 13, PIECEt: 14, PIECEVertJ: 15});

function Block(x, y) {
	this.x = x;
	this.y = y;
}

function Tile() {
	this.value = 0;
	this.delete = false;
}
