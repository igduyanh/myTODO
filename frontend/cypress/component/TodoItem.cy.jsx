import { TodoItem } from '../../src/components/TodoItem';

describe('TodoItem - Component Testing', () => {
  let baseTodo;
  let inputs;

  beforeEach(() => {
    cy.fixture('todos').then((todosData) => {
      baseTodo = todosData.baseTodo;
      inputs = todosData.inputs;
    });
  });

  function mountComponent(props = {}) {
    const defaultProps = {
      todo: baseTodo,
      editing: false,
      onToggle: cy.stub().as('onToggle'),
      onDestroy: cy.stub().as('onDestroy'),
      onEdit: cy.stub().as('onEdit'),
      onSave: cy.stub().as('onSave'),
      onCancel: cy.stub().as('onCancel'),
    };

    cy.mount(<TodoItem {...defaultProps} {...props} />);
  }

  it('Render đúng nội dung todo', () => {
    mountComponent();
    cy.contains(inputs.item1).should('be.visible');
  });

  it('Hiển thị trạng thái completed từ props', () => {
    mountComponent({
      todo: { ...baseTodo, completed: true },
    });
    cy.get('input[type=checkbox]').should('be.checked');
  });

  it('Click checkbox → gọi onToggle', () => {
    mountComponent();
    cy.clickToggleBtn();
    cy.get('@onToggle').should('have.been.calledOnce');
  });

  it('Click delete → gọi onDestroy', () => {
    mountComponent();
    cy.clickDeleteBtn();
    cy.get('@onDestroy').should('have.been.calledOnce');
  });

  it('Click Edit → gọi onEdit callback', () => {
    mountComponent();
    cy.clickEditBtn();
    cy.get('@onEdit').should('have.been.calledOnce');
  });

  it('editing = true → hiển thị input edit', () => {
    mountComponent({
      editing: true,
    });
    cy.verifyEditInputVisible();
  });

  it('Nhập text + Enter → gọi onSave', () => {
    mountComponent({
      editing: true,
    });
    cy.typeItemInput(`${inputs.newTitle}{enter}`);
    cy.get('@onSave').should('have.been.calledWith', inputs.newTitle);
  });

  it('Nhấn ESC → gọi onCancel', () => {
    mountComponent({
      editing: true,
    });
    cy.cancelEditItem();
    cy.get('@onCancel').should('have.been.calledOnce');
  });

  it('UI thay đổi khi todo completed', () => {
    mountComponent({
      todo: { ...baseTodo, completed: true },
    });
    cy.get('li').should('have.class', 'list-group-item-success');
  });

  it('UI có class editing khi editing = true', () => {
    mountComponent({
      editing: true,
    });
    cy.get('li').should('have.class', 'editing');
  });
});
