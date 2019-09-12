import React, { useState } from 'react'
import { createAccount, createAccountFromPrivateKey } from '../../messaging'
import ErrorMessage from '../ErrorMessage'
import './index.scss'

function NameAndPassword(props) {
  const { type, secret, onSuccess } = props;
  const [obj, setObj] = useState({name: '', pass: '', repass: ''})
  const [errMsg, setErrMsg] = useState('')

  const check = () => {
    console.log(obj)
    if (!obj.name || !obj.pass || !obj.repass) {
      setErrMsg('name and password are required')
      return false
    }
    if (obj.pass !== obj.repass) {
      console.log('in not match')
      setErrMsg('password is not match')
      return false
    }
    return true
  }

  const create = async() => {
    console.log(type, secret)
    if (!check()) {
      return
    }
    console.log('start create')
    let handler = createAccount
    if (type === 'pk') {
      handler = createAccountFromPrivateKey
    }
    handler(obj.name, obj.pass, secret).then(_ => {
      onSuccess()
    }).catch(err => {
      setErrMsg(err.message)
    })
  }

  return (
    <>
      <input className="input" type="text"
        required
        value={obj.name}
        onChange={e => setObj({...obj, ['name']: e.target.value})}
        placeholder="标签（12字符以内）" />
      <input className="input" type="password"
        value={obj.pass}
        onChange={e => setObj({...obj, ['pass']: e.target.value})}
        placeholder="密码" />
      <input className="input" type="password"
        value={obj.repass}
        onChange={e => setObj({...obj, ['repass']: e.target.value})}
        onKeyPress={event => {
          if (event.key === "Enter") {
            create()
          }
        }}
        placeholder="确认密码" />
      <button className="button button-yellow margin-top-40"
        onClick={() => {
          create()
        }}
      >完成</button>
      <ErrorMessage msg={errMsg} />
    </>
  )
}

export default NameAndPassword
