// import { browser } from "webextension-polyfill-ts"
import { computePosition } from '@floating-ui/dom';
import * as en from '../data/en_UK.json';

const div = document.createElement('div')
div.style.position = 'absolute'
div.style.border = '2px solid gray'
div.style.borderRadius = '5px'
div.style.padding = '8px'
div.style.filter = 'drop-shadow(gray 2px 2px 2px)'
div.style.backgroundColor = 'white'
div.style.zIndex = '99'
div.style.visibility = 'hidden'

const p = document.createElement('p')
p.style.margin = '0'
p.style.color = 'black'
div.appendChild(p)
document.body.appendChild(div)

document.addEventListener('mouseup', _ => {
  get_ipa_of_selection()
})

document.addEventListener('mousedown', _ => {
  get_ipa_of_selection()
})

function get_ipa_of_selection() {
  const selection = window.getSelection()
  if (selection == null) {
    div.style.visibility = 'hidden'
    return
  }
  const selected_text = selection.toString()
  if (selected_text == null || selected_text == "") {
    div.style.visibility = 'hidden'
    return
  }

  // const settings = await browser.storage.sync.get()
  const dict = en.en_UK[0]

  const ipas = convert_to_ipa(dict, selected_text)

  if (ipas.length === 0) {
    div.style.visibility = 'hidden'
    return
  }

  display_popup(ipas, selection)
}

function convert_to_ipa(dict: {[w: string]: string}, selected_text: string): Array<string> {
  const ipas: Array<string> = []
  const splitted = selected_text.split(' ')
  for (const raw_word of splitted) {
    let non_alpha_before = ''
    let non_alpha_after = ''
    let word = ''
    for (const char of raw_word.toLowerCase()) {
      if (word === '' && !is_letter(char)) {
        non_alpha_before += char
      } else if (is_letter(char)) {
        word += char
      } else if (word !== '' && !is_letter(char)) {
        non_alpha_after += char
      }
    }

    if (dict.hasOwnProperty(word)) {
      ipas.push(non_alpha_before + dict[word as keyof typeof dict] + non_alpha_after)
    } else if (splitted.length > 1) {
      ipas.push(non_alpha_before + word + non_alpha_before)
    }
  }

  return ipas
}

function is_letter(c: string): boolean {
  return c.toLowerCase() != c.toUpperCase();
}

function display_popup(ipas: Array<string>, selection: Selection) {
  p.innerText = ipas.join(' ')
  div.style.visibility = 'visible'

  // anchor node is the node where the selection begins
  if (selection.anchorNode !== null) {
    let element: Element | null = null
    if (selection.anchorNode.nodeType === 1) {
      // this is an element as well; nodeType = 1 means ELEMENT_NODE
      element = selection.anchorNode as Element
    } else {
      element = selection.anchorNode.parentElement
    }
    if (element != null) {
      computePosition(element, div).then(({ x, y }) => {
        div.style.top = `${y}px`
        div.style.left = `${x}px`
      })
    }
  }
}

