import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';
import { ChatEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('chat-view')
export class ChatView extends LitElement {
  @state()
  messages: string[] = [];

  async connectedCallback() {
    super.connectedCallback();
    ChatEndpoint.join().onNext((msg) => {
      this.messages = [...this.messages, msg];
    });
  }

  render() {
    return html`
      <div id="container" style="flex-grow: 1;overflow:auto;">
        ${this.messages.map((message) => html`<div>${message}</div>`)}
      </div>
      <vaadin-text-field autofocus autocomplete="off" @keydown=${this.messageInput}></vaadin-text-field>
    `;
  }

  protected updated(): void {
    this.renderRoot.querySelector('#container')!.scrollTop=10000000;
  }

  private messageInput(e: KeyboardEvent) {
    const input = e.currentTarget as TextField;
    const value = input.value.trim();
    if (e.key == 'Enter' && value.length > 0) {
      ChatEndpoint.send(value);
      input.clear();
    }
  }
}
