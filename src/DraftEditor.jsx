import React, { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { Bounce, toast } from "react-toastify";

const EditorCustomStyle = {
  BOLD: {
    fontWeight: "bold",
  },
  UNDERLINE: {
    textDecoration: "underline",
    fontWeight: "normal",
  },
  REDLINE: {
    color: "red",
    fontWeight: "normal",
  },
};

export default function DraftEditor() {
  const [editorState, setEditorState] = useState(() => {
    const savedContent = localStorage.getItem("editorContent");
    return savedContent
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
      : EditorState.createEmpty();
  });

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (char) => {
    if (char !== " ") return "not-handled";

    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const text = block.getText();

    if (selection.getStartOffset() !== text.length) return "not-handled";

    let newEditorState = editorState;

    switch (text) {
      case "#":
        const contentWithoutHash = Modifier.replaceText(
          newEditorState.getCurrentContent(),
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );
        newEditorState = EditorState.push(
          newEditorState,
          contentWithoutHash,
          "remove-characters"
        );
        newEditorState = RichUtils.toggleBlockType(
          newEditorState,
          "header-one"
        );
        setEditorState(newEditorState);
        return "handled";

      case "*":
        const contentWithoutStar = Modifier.replaceText(
          newEditorState.getCurrentContent(),
          selection.merge({
            anchorOffset: 0,
            focusOffset: 1,
          }),
          ""
        );
        newEditorState = EditorState.push(
          newEditorState,
          contentWithoutStar,
          "remove-characters"
        );
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, "BOLD");
        setEditorState(newEditorState);
        return "handled";

      case "**":
        const contentWithoutDoubleStars = Modifier.replaceText(
          newEditorState.getCurrentContent(),
          selection.merge({
            anchorOffset: 0,
            focusOffset: 2,
          }),
          ""
        );
        newEditorState = EditorState.push(
          newEditorState,
          contentWithoutDoubleStars,
          "remove-characters"
        );
        newEditorState = RichUtils.toggleInlineStyle(newEditorState, "REDLINE");
        setEditorState(newEditorState);
        return "handled";

      case "***":
        const contentWithoutTripleStars = Modifier.replaceText(
          newEditorState.getCurrentContent(),
          selection.merge({
            anchorOffset: 0,
            focusOffset: 3,
          }),
          ""
        );
        newEditorState = EditorState.push(
          newEditorState,
          contentWithoutTripleStars,
          "remove-characters"
        );
        newEditorState = RichUtils.toggleInlineStyle(
          newEditorState,
          "UNDERLINE"
        );
        setEditorState(newEditorState);
        return "handled";

      default:
        return "not-handled";
    }
  };

  const handleSave = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(content))
    );
    toast("Content saved to local storage!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div></div>

        <h4 className="title-name">Demo Editor by Saurabh Sharma</h4>

        <button className="save" onClick={handleSave}>
          Save
        </button>
      </div>
      <div className="text-editor">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={EditorCustomStyle}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
}
