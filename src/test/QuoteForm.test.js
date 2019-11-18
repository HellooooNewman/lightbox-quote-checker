import React from 'react';
import QuoteForm from '../QuoteForm';
import { mount } from 'enzyme';

describe('QuoteForm component', () => {
  it('should return new quote', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'create words to live by' } })
    form.simulate('submit');

    const result = quoteForm.find('.new-quote');
    expect(result.text()).toEqual('CREATE \nWORDS TO \nLIVE BY\n\n');
  });

  it('should return new quote for kevin', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'Kevin' } })
    form.simulate('submit');

    const result = quoteForm.find('.new-quote');
    expect(result.text()).toEqual('KEVIN\n\n');
  });

  it('should return an error because there arent enough characters', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'Kevinnnnn' } })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  You're missing a few characters: Here's a list: N,N,N. Please try to be more creative.`);
  });

  it('should return an error because there isnt any text', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: '' } })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  Please add some text.`);
  });

  it('should return an error because the quote is to long', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'This is a really long quote that keeps going and should not fit'} })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  Quote is too long.`);
  });

  it('should return an error because the quote has an unsupported character in it', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'Unsupported Characters!'} })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  Unsupported characters in quote.`);
  });

  it('should return an error because the quote has a word that is to long', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'Jazzinesses'} })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  Jazzinesses is to long for the box.`);
  });

  it('should return an error because the quote has to many line breaks', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'abcde fghij klmnop qrstuv 12345'} })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  You have to many line breaks in your message. The box only supports 3 lines.`);
  });

  it('should return a text with alterntive characters', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    form.find('#quotetext').simulate('change', { target: { value: 'BEEEE'} })
    form.simulate('submit');

    const result = quoteForm.find('.new-quote');
    expect(result.text()).toEqual(`BEEE3\n\n`);
  });

  it('should return a text without alterntive characters', () => {
    const quoteForm = mount(<QuoteForm />);
    const form = quoteForm.find('form');

    quoteForm.setState({ recommendAlternativeCharacters: false });

    form.find('#quotetext').simulate('change', { target: { value: 'BEEEE'} })
    form.simulate('submit');

    const result = quoteForm.find('.error');
    expect(result.text()).toEqual(`❌🙃  You're missing a few characters: Here's a list: E. Please try to be more creative.`);
  });
})