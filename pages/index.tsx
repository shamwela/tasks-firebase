import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
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

  return (
    <>
      <Head>
        <title>Tasks Firebase</title>
      </Head>
      <h1>Tasks Firebase</h1>
      {tasks?.map(({ id, name, completed }) => (
        <div key={id}>
          <span style={{ marginRight: '2rem' }}>{name}</span>
          <span>{completed ? 'Completed' : 'Not completed'}</span>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={newTaskName}
          onChange={handleNewTaskName}
          placeholder='Task name'
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
