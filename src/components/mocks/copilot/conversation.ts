import type { DemoQuestion } from '@/content/landing/copilotDemo';

export function appendQuestion(
  conversation: HTMLElement,
  question: DemoQuestion
) {
  // Bound the transcript without changing the saved sample plan.
  while (conversation.children.length >= 3)
    conversation.firstElementChild?.remove();
  const exchange = document.createElement('div');
  exchange.className = 'qa-exchange';
  const prompt = document.createElement('p');
  prompt.className = 'qa-user';
  prompt.textContent = question.label;
  const answer = document.createElement('p');
  answer.className = 'qa-answer';
  answer.dataset.pending = 'true';
  answer.textContent = 'Revisiting the tool results…';
  exchange.append(prompt, answer);
  conversation.append(exchange);
}
