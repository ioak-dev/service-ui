import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from "react";
import DomainList, { DomainListProps } from '.';
import { ACCESS_TOKEN } from '../service/LocalTestingService';

const meta: Meta<typeof DomainList> = {
  title: "Composite/DomainList",
  component: DomainList,
  argTypes: {
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof DomainList>;


const Template: Story = {
  render: (args: DomainListProps) => {
    return (
      <div>
        <DomainList {...args} />
      </div>
    );
  },
};

const props: DomainListProps = {
  showSearch: false,
  space: "1",
  domain: "fragment",
  apiBaseUrl: "http://localhost:4000/api",
  authorization: { isAuth: true, access_token: ACCESS_TOKEN }
}

export const Playground = {
  ...Template, args: {
    ...props
  }
};
