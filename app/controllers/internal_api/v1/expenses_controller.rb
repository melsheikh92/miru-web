# frozen_string_literal: true

class InternalApi::V1::ExpensesController < ApplicationController
  before_action :set_expense, only: :show

  def index
    authorize Expense

    expenses = Expenses::FetchService.new(current_company, params).process

    render :index, locals: expenses
  end

  def create
    authorize Expense

    expense = current_company.expenses.create!(expense_params)

    render :create, locals: {
      expense: Expense::ShowPresenter.new(expense).process
    }
  end

  def show
    authorize @expense

    render :show, locals: { expense: Expense::ShowPresenter.new(@expense).process }
  end

  private

    def expense_params
      params.require(:expense).permit(
        :amount, :date, :description, :expense_type, :expense_category_id, :vendor_id, :receipts
      )
    end

    def set_expense
      @expense = Expense.find(params[:id])
    end
end
