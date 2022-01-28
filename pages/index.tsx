import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import Head from 'next/head'
import { firebaseConfig } from '../firebase'
import { initializeApp } from 'firebase/app'

type Task = {
  id: string
  name: string
  completed: boolean
}
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const Home = () => {
  const [tasks, setTasks] = useState<Task[] | undefined>(undefined)
  const [newTaskName, setNewTaskName] = useState<string | undefined>(undefined)

  const handleNewTaskName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskName(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const id = Date.now().toString()
    const name = newTaskName
    const completed = false

    const newDocument = doc(db, 'tasks', id)
    await setDoc(newDocument, { name, completed })
  }

  useEffect(() => {
    const getData = async () => {
      const tasksReference = collection(db, 'tasks')
      const documents = await getDocs(tasksReference)

      let tasks: Task[] = []
      documents.forEach((document) => {
        const { id } = document
        const { name, completed } = document.data()
        const newTask = { id, name, completed }
        tasks.push(newTask)
      })
      setTasks(tasks)
    }
    getData()
  })

  const toggleCompletion = async (id: string, completed: boolean) => {
    const documentReference = doc(db, 'tasks', id)
    await updateDoc(documentReference, { completed: !completed })
  }

  const handleDelete = async (id: string) => {
    const documentReference = doc(db, 'tasks', id)
    await deleteDoc(documentReference)
  }

  return (
    <>
      <Head>
        <title>Tasks</title>
        <meta name='description' content='Task manager built with Firebase' />
      </Head>
      <h1>Tasks</h1>
      {tasks?.map(({ id, name, completed }) => (
        <div key={id}>
          <span style={{ marginRight: '2rem' }}>{name}</span>
          <span
            onClick={() => toggleCompletion(id, completed)}
            className='cursor-pointer'
          >
            {completed ? 'Completed' : 'Not completed'}
          </span>

          <button onClick={() => handleDelete(id)} className='btn btn-danger'>
            Delete
          </button>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={newTaskName}
          onChange={handleNewTaskName}
          placeholder='Task name'
          aria-label='Task name'
          type='text'
          required
        />
        <button type='submit' className='btn btn-primary'>
          Add task
        </button>
      </form>
    </>
  )
}

export default Home
