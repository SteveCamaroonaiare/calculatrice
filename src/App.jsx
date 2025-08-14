import React,{ useState,useEffect,useMemo} from 'react'

import './App.css'

function App() {
const [affichage, setAffichage] = useState("0");
const [operation, setOperation] = useState(null);
const [valeurprecedente, setValeurPrecedente] = useState(null);

//ici nous allons utiliser useMemo pour calculer la taille du texte en fonction de la longueur de l'affichage
 const tailletext = useMemo(() => {
  const len = affichage.length;
  return { fontSize: `${Math.max(18, 48 - (len - 8) * 2)}px` }
  }, [affichage]);
    

// Fonction pour choisir l'opération
  const ajouterChiffre_point = (val) => {
  setAffichage(a => {
    if (val === "." && a.includes(".")) return a;
    return a === "0" && val !== "." ? val : a + val;
  });
};

//ici nous allons utiliser une fonction pour choisir l'opération
  const ajouterOperation = (op) => {
    setValeurPrecedente(affichage);
    setAffichage("0");
    setOperation(op);
  };

  //ici nous allons utiliser une fonction pour calculer le résultat
  //2 cas pour les grand entiers et les décimaux
  const calculerResultat = () => {  

    const est_un_entier=  (v) => { /^\d+\.$/.test(v) };
    const entier1 = est_un_entier(valeurprecedente) 
    const entier2 = est_un_entier(affichage)
    const resultat=() => {
      if(entier1 && entier2) {
        const a=BigInt(valeurprecedente);
        const b=BigInt(affichage);
        if(operation==="+") return (a+b).toString();
        if(operation==="-") return (a-b).toString();
        if(operation==="*") return (a*b).toString();
        if(operation==="/") return  b !==0n ? ((Number(a)/Number(b)).toString()) : "Erreur";
    
      } else {
        const a =parseFloat(valeurprecedente);
        const b =parseFloat(affichage);
        if(operation=== "+") return (a+b).toString(); 
        if(operation=== "-") return (a-b).toString();
        if(operation=== "*") return (a*b).toString();
        if(operation=== "/") return b !==0 ? (a/b).toString() : "Erreur";
      }
    }
    setAffichage(resultat());
    setOperation(null);
    setValeurPrecedente(null);
  };
 

  //ici nous allons utiliser useEffect pour écouter les touches du clavier
  useEffect(() => {
    const AppuyerUneTouche=(e) => {
      const s= e.key;
      if("0123456789.".includes(s)) {
        ajouterChiffre_point(s);
      } 
      if( s==="+" || s==="-" || s==="*" || s==="/") {
        choisir(s==="*" ? "x" : s==="/" ? "÷" : s);
      }
      if(s==="Entrer" || s==="=") {
        e.preventDefault();
        calculerResultat();
      }
      if(s==="Delete") {
        (a) => {a.length>1 ?a.slice(0,-1) : "0"};
        setAffichage(a);
      }
      if(s==="Escape") {
        setAffichage("0");
        setOperation(null);
        setValeurPrecedente(null);
      }
    };

    window.addEventListener("keydown", AppuyerUneTouche);
    return () => {
      window.removeEventListener("keydown", AppuyerUneTouche);
    };
  }, [affichage, operation, valeurprecedente]);

  const boutons = [
    '7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '+', '-', 'x' ,'÷', '='
  ];


return (
  <>
    <div className="container">
      <div className="visuel" style={tailletext}>{affichage}</div>
      <div className="clavier">
        {boutons.map(bouton => (
          <button
            key={bouton}
            onClick={() => {
              if ("0123456789.".includes(bouton)) {
                ajouterChiffre_point(bouton);
              } else if (["+", "-", "x", "÷"].includes(bouton)) {
                ajouterOperation(
                  bouton === "x" ? "*" :
                  bouton === "÷" ? "/" : bouton
                );
              } else if (bouton === "=") {
                calculerResultat();
              } else if (bouton === "reset") {
                setAffichage("0");
                setOperation(null);
                setValeurPrecedente(null);
              }
            }}
          >
            {bouton}
          </button>
        ))}



        {valeurprecedente !== null || operation !== null?(

                  <button onClick={() => {
                    setAffichage( a => a.length > 1 ? a.slice(0, -1) : "0");
                  }}>⌫</button>)
                  :
                  (<button onClick={() => {
                    setAffichage("0");
                    setOperation(null);
                    setValeurPrecedente(null);
                  }}>C</button>)
                }
              </div>
            </div>
          </>
        );
        }

export default App
