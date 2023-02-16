import React from 'react'
import { Upload } from 'antd'
import { useState } from 'react'

export default function PicUpload() {

  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
  ])
  const onChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList)
    console.log(file, newFileList, file === newFileList[newFileList.length-1])
  }
  const onPreview = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    imgWindow?.document.write(image.outerHTML)
  }

  return (
    <Upload
      action="http://124.222.167.196:5000/uploadFile"
      listType="picture-card"
      fileList={fileList}
      onChange={onChange}
      onPreview={onPreview}
    >
      {fileList.length < 3 && '+ Upload'}
    </Upload>
  )
}
