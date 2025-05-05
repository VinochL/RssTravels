import './App.css';
import React, { Component } from 'react';
import { collection, getFirestore, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { app } from './firebase';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notes: []    
    }  
  }

  async refreshNotes() {
    const notesList = [];
    const db = getFirestore(app);
    const notesCol = collection(db, 'Notes');
    const notesSnapshot = await getDocs(notesCol);
    
    notesSnapshot.forEach(doc => {
      let note = doc.data();
      note.id = doc.id;
      notesList.push(note);
    });   

    this.setState({
      notes: notesList
    });
  }

  async addClick() {
    var newNotes = document.getElementById("newNotes").value;
    var NewNotesObject = {
      Description: newNotes
    };     
    const db = getFirestore(app);
    const notesCol = collection(db, 'Notes');
    await addDoc(notesCol, NewNotesObject);
  
    this.refreshNotes();
  }
   


  async deleteClick(id) {
      const db = getFirestore(app);     
      const noteRef = doc(db, 'Notes/'+id);

      await deleteDoc(noteRef);
      this.refreshNotes();
    }


  componentDidMount() {
    this.refreshNotes();
  }  

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h2>Todo App</h2>
        <input id="newNotes"/> &nbsp;
        <button onClick={()=> this.addClick()}>Add Notes</button>

        {notes.map(note => (
          <p>
          <b key={note.id}>* {note.Description}</b> &nbsp;
          <button onClick={() => this.deleteClick(note.id)}>Delete</button>
          </p>
        ))}
      </div>
    );
  }
}

export default App;
