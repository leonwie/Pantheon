import React from 'react'
import HomeHeader from '../src/Components/HomeHeader'
import renderer from 'react-test-renderer'

describe('<HomeHeader />', () => {
  it('renders correctly', () => {
    const component = renderer.create(
      <HomeHeader
        title="Formula One"
        navigation={{}} />
    ).toJSON()

    expect(component).toMatchSnapshot()
  })
})
