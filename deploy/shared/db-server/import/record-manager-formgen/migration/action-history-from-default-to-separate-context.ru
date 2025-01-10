PREFIX rm: <http://onto.fel.cvut.cz/ontologies/record-manager/>

DELETE {
   GRAPH <http://www.ontotext.com/explicit>{
       ?a ?p ?o .
   }
}
INSERT {
   GRAPH rm:action-history {
       ?a ?p ?o .
   }
}
WHERE {
   GRAPH <http://www.ontotext.com/explicit> {
       ?a ?p ?o .
       ?a a rm:action-history .
   }
}
