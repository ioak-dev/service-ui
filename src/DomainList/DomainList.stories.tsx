import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from "react";
import DomainList, { DomainListProps } from '.';

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
}

export const Playground = {
  ...Template, args: {
    ...props
  }
};
