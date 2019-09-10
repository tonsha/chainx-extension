import React from 'react'
import { useState } from 'react'
// @ts-ignore
import Account from '@chainx/account'
import { createAccount } from '../../messaging'
import shuffle from 'lodash.shuffle'
import './createAccount.scss'

function CreateAccount(props: any) {
  
  const titleList = ['新增账户', '备份助记词', '验证助记词', '设置标签和密码']
  const subTitleList = ['', '按顺序记下你的助记词，下一步中需要用到', '按备份顺序点击下方助记词', '密码包含至少 8 个字符、大写与小写字母、至少一个数字']
  const buttonTextList = ['开始', '下一步', '下一步', '完成']
  
  const [currentStep, setCurrentStep] = useState(0)
  const [errMsg, setErrMsg] = useState('')
  const [mnemonic] = useState(Account.newMnemonic())
  const mnemonicList = mnemonic.split(' ')
  const [shuffleMnemonicList] = useState(shuffle(mnemonicList))
  const mnemonicWords = mnemonicList.map((item: string, index: number) => ({ value: item, index: index }))

  return (
    <div className="container create-account">
      <div className="create-account-title">
        <span>{titleList[currentStep]}</span>
        <span className="create-account-sub-title">{subTitleList[currentStep]}</span>
      </div>
      <div className="create-account-body">
        <div className="create-account-body-content">
          {
            currentStep === 0 && 
            <div className="start">
              <span>不要将您的助记词存储在电脑上，或者网上某处。任何拥有您助记词的人都能取用您的资金</span>
            </div>
          }
          {
            currentStep === 1 && 
            mnemonicWords.map((item: any) => (
              <div className="word-item" key={item.index}>
                {item.value}
              </div>
            ))
          }
          {
            currentStep === 2 && 
            shuffleMnemonicList.map((item: any, index: number) => (
              <div className="word-item word-item-click" key={index}>
                {item}
              </div>
            ))
          }
          {
            currentStep === 3 && 
            <>
              <input className="input-submit" type="text" name="password" placeholder="标签（12字符以内）" />
              <input className="input-submit" type="password" name="password" placeholder="密码" />
              <input className="input-submit" type="password" name="repassword" placeholder="确认密码" />
            </>
          }
        </div>
        {
          errMsg ? <span className="error-message">{errMsg}</span> : null
        }
        <button className="button-yellow-full margin-top-40"
          onClick={() => {
            if (currentStep < 3) {
              setCurrentStep(currentStep+1)
            }
            if (currentStep === 3) {
              const name = 'xat'
              const pass = 'password'
              console.log(name, pass, mnemonic)
              createAccount(name, pass, mnemonic).then(data => {
                props.history.push('/')
              }).catch(err => {
                setErrMsg(err.message)
              })
            }
          }}
        >{buttonTextList[currentStep]}</button>
      </div>
    </div>
  )
}

export default CreateAccount