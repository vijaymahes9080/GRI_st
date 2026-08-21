import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Submit Application" onPress={() => {}} />);
    expect(getByText('Submit Application')).toBeTruthy();
  });

  it('triggers onPress event when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Press Me" onPress={onPressMock} />);

    fireEvent.press(getByText('Press Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled or loading', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button title="Disabled" onPress={onPressMock} disabled />);

    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
