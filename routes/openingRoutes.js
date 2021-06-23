import express from "express";
import dataA from "../openingData/dataA.js";
import dataB from "../openingData/dataB.js";
import dataC from "../openingData/dataC.js";
import dataD from "../openingData/dataD.js";
import dataE from "../openingData/dataE.js";
import main_openings from "../openingData/main_openings.js";
import chess from "chess.js";
const { Chess } = chess;

const router = express.Router();

router.get("/main-opening-names", (req, res) => {
  res.send(JSON.stringify(main_openings));
});

router.get("/variations", (req, res) => {
  res.send(
    JSON.stringify(getNames(req.query.eco.charAt(0), req.query.firstName))
  );
});

const getNames = (letter, name) => {
  switch (letter) {
    case "A":
      return dataA.filter((opening) => opening.name.includes(name));
    case "B":
      return dataB.filter((opening) => opening.name.includes(name));
    case "C":
      return dataC.filter((opening) => opening.name.includes(name));
    case "D":
      return dataD.filter((opening) => opening.name.includes(name));
    case "E":
      return dataE.filter((opening) => opening.name.includes(name));
    default:
      return "default";
  }
};

router.get("/test", (req, res) => {
  const newDataA = [];
  dataE.forEach((opening) => {
    const algNotation = algebraicConvert(opening.moves);

    const openingObj = {
      eco: opening.eco,
      name: opening.name,
      fen: opening.fen,
      moves: opening.moves,
      an: algNotation,
      hasCont: hasContinuation(opening, dataE),
    };
    newDataA.push(openingObj);
  });

  res.send(JSON.stringify(newDataA));
});

const algebraicConvert = (fenString) => {
  const chess = new Chess();
  const An = [];
  let moveBuffer = "";
  for (let i = 0; i < fenString.length; i++) {
    if (i !== fenString.length - 1) {
      if (fenString.charAt(i) !== " ") {
        moveBuffer += fenString.charAt(i);
      } else {
        const { san } = chess.move(moveBuffer, { sloppy: true });
        An.push(san);
        moveBuffer = "";
      }
    } else {
      moveBuffer += fenString.charAt(i);
      const { san } = chess.move(moveBuffer, { sloppy: true });
      An.push(san);
    }
  }
  let str = "";
  for (let j = 0; j < An.length; j++) {
    str += An[j];
    if (j != An.length - 1) {
      str += " ";
    }
  }
  return str;
};

const hasContinuation = (variation, varList) => {
  let hc = false;
  varList.forEach((variat) => {
    if (variat.an.includes(variation.an) && variat.name !== variation.name) {
      hc = true;
    }
  });
  return hc;
};

export default router;
