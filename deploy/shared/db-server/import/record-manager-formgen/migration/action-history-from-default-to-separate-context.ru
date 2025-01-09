DELETE {
   GRAPH <http://www.ontotext.com/explicit>{
       ?a ?p ?o .
   }
}
INSERT {
   GRAPH <http://onto.fel.cvut.cz/ontologies/record-manager/action-history> {
       ?a ?p ?o .
   }
}
WHERE {
   GRAPH <http://www.ontotext.com/explicit> {
       ?a ?p ?o .
       ?a a <http://onto.fel.cvut.cz/ontologies/record-manager/action-history> .
   }
}