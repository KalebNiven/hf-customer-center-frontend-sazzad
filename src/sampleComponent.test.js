import { render, screen } from '@testing-library/react';
import { SampleComponent } from './sampleComponent';

describe("Render app", () => {
    test('renders sample component', () => {
        render(<SampleComponent />);
        let linkElement = screen.getByTestId('mycomponent');
        expect(linkElement).toBeInTheDocument();
        expect(1 + 2).toBe(3)
    })
})