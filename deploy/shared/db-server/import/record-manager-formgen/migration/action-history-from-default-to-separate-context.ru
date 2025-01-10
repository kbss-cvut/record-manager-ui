PREFIX rm: <http://onto.fel.cvut.cz/ontologies/record-manager/>

DELETE {   
   ?a ?p ?o .
}
INSERT {
   GRAPH rm:action-history {
       ?a ?p ?o .
   }
}
WHERE {
   ?a ?p ?o .
   ?a a rm:action-history .
   
   MINUS {
     GRAPH ?g {
    	?a ?p ?o .
     }
   }
}
