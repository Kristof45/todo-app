import { useState, useEffect } from 'react'

const STORAGE_KEY = 'todos-app'

function App() {
  //szuro belso allapota
  const [filter, setFilter] = useState('all')

  // todo listajanak az allapota
  //const [todos, setTodos] = useState([])
  //todo belso allapot betoltese localstoragebol ha az ures, akkor ures lesz a todos belso alllapot
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.log(`Hiba a localstorage beolvasasakor: ${error}`);
      return [] //ha nem tudja bolvasni a localstorage-bol akkor ures tomb lesz a belso allapot
    }
  })

  //input mezo belso allapota
  const [text, setText] = useState('')

  //mentes localstorage-be amikor valtozik a lista, annyiszor fut le ahanyszor a todos valtozik
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.log(`Hiba a localstorage irasakor: ${error}`);
    }
  }, [todos])


  // hagyomanyos adatbetoltes
  /*
  const toggleTodo = (id) => {
    setTodos((prev) => {
      prev.map((prevTodo) => {
        let newTodo
        if (prevTodo.id === id) {
          newTodo.id = prevTodo.id
          newTodo.text = prevTodo.text
          newTodo.isChecked = !prevTodo.isChecked
        }
        else {
          newTodo = prevTodo
        }

        return newTodo
      })
    })
  }
*/
  //spread operatorral
  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, isChecked: !prevTodo.isChecked } : prevTodo
      )
    )
  }

  //uj feladat hozzaadasa
  const addTodo = () => {
    const todoText = text.trim()

    if (!todoText) return

    const newTodo = {
      id: crypto.randomUUID(),
      text: todoText,
      isChecked: false,
      createdAt: Date.now()
    }

    setTodos((prev) => [newTodo, ...prev])
    setText('')
  }

  //ha leutom az entert az input mezoben akkor is lefut az addTodo
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addTodo()
    }
  }

  //egy todo torlese id alapjan
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id))
  }

  //osszes kijelolt todo torlese
  const clearCompleted = () => {
    setTodos((prev) => prev.filter((prevTodo) => !prevTodo.isChecked))
  }

  //uj tomb a todosbol es modositsuk bizonyos feltetlek szerint
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.isChecked
    if (filter === 'done') return todo.isChecked
    return true

  })

  //hany feladat van hatra
  const activeCount = todos.filter((todo) => !todo.isChecked).length

  return (
    <div className='app-root'>
      <div className="todo-card">
        {/* fejléc */}
        <header>
          <h1>Teendőlista</h1>
          <p>Egyszerű todo app</p>
        </header>

        {/* input mező + hozzadas gomb*/}
        <div className="input-row">
          <input type="text" placeholder='Egy új feladat hozzáadása' value={text} onChange={(event) => setText(event.target.value)} onKeyDown={handleKeyDown} />
          <button type="button" onClick={addTodo}>Hozzáad</button>
        </div>

        {todos.length > 0 ? (
          <>
            {/*ha van todo listank */}
            {/*szuro sav */}
            <div className="toolbar">
              <div className="filter">
                <button type="button" className={filter === 'all' ? 'black' : ''} onClick={() => setFilter('all')}  >Mind</button>
                <button type="button" className={filter === 'active' ? 'black' : ''} onClick={() => setFilter('active')}  >Aktiv</button>
                <button type="button" className={filter === 'done' ? 'black' : ''} onClick={() => setFilter('done')}  >Kesz</button>
              </div>
              <button type="button" className='clear-btn' disabled={todos.every((todo) => !todo.isChecked)} onClick={clearCompleted} >Kesz feladatok torlese</button>
            </div>

            {/*todok felsorolas lista */}
            <ul className="todo-list">
              {filteredTodos.map((todo) => {
                return <li key={todo.id} className={todo.isChecked ? 'completed' : ''} onChange={() => toggleTodo(todo.id)}>
                  <label >
                    <input type="checkbox" checked={todo.isChecked} />
                    <span className="todo-text">{todo.text}</span>
                  </label>
                  <button type="button" className='delete-btn' onClick={() => deleteTodo(todo.id)} >X</button>
                </li>
              })}
            </ul>

            {/* footer */}
            <footer>
              <span>{activeCount} feladat van hatra</span>
            </footer>
          </>
        ) : (
          <>
            {/*empty-state ha nincs hozzadava teendo*/}
            <p className="empty-state">Meg nincs teendod hozzaadva. Irj be valamit es nyomd meg a <strong>Hozzadas</strong> gombot.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default App
