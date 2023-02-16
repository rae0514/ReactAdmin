import React, {forwardRef, useImperativeHandle, useState} from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

function RichTextEditor(props, ref) {

  let initialEditor

  if(props.detail) {
    const contentBlock = htmlToDraft(props.detail)
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
    initialEditor = EditorState.createWithContent(contentState)
  } else {
    initialEditor = EditorState.createEmpty()
  }
 
   const [editorState, seteditorState] = useState(initialEditor)

  function onEditorStateChange(editorState) {
    seteditorState(editorState)
  }

  function getDetail() {
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  useImperativeHandle(ref, () => ({
    getDetail
  }))
 
  return (
    <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        editorStyle={{border:'1px solid slategrey', paddingLeft:10, minHeight:200}}
    />
  )
}

export default forwardRef(RichTextEditor)