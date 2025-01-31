# frozen_string_literal: true

require "rails_helper"

RSpec.describe ClientPolicy, type: :policy do
  let(:company) { create(:company) }
  let(:client) { create(:client, company:) }
  let(:admin) { create(:user, current_workspace_id: company.id) }
  let(:employee) { create(:user, current_workspace_id: company.id) }
  let(:owner) { create(:user, current_workspace_id: company.id) }
  let(:book_keeper) { create(:user, current_workspace_id: company.id) }

  before do
    owner.add_role :owner, company
    admin.add_role :admin, company
    employee.add_role :employee, company
    book_keeper.add_role :book_keeper, company
  end

  permissions :index? do
    it "grants permission to an admin, employee and owner" do
      expect(described_class).to permit(owner)
      expect(described_class).to permit(admin)
      expect(described_class).to permit(employee)
    end

    it "does not grants permission to book_keeper" do
      expect(described_class).not_to permit(book_keeper)
    end
  end

  permissions :create? do
    it "grants permission to an admin and an owner" do
      expect(described_class).to permit(admin)
      expect(described_class).to permit(owner)
    end

    it "does not grants permission to an employee and a book keeper" do
      expect(described_class).not_to permit(employee)
      expect(described_class).not_to permit(book_keeper)
    end
  end

  permissions :show?, :update?, :destroy? do
    context "when user is an admin or owner" do
      it "grants permission" do
        expect(described_class).to permit(admin, client)
        expect(described_class).to permit(owner, client)
      end
    end

    context "when user is an employee, book_keeper" do
      it "does not grant permission" do
        expect(described_class).not_to permit(employee, client)
        expect(described_class).not_to permit(book_keeper, client)
      end
    end

    context "when user is from another company" do
      let(:another_company) { create(:company) }
      let(:another_admin) { create(:user, current_workspace_id: another_company.id) }
      let(:another_employee) { create(:user, current_workspace_id: another_company.id) }
      let(:another_owner) { create(:user, current_workspace_id: another_company.id) }
      let(:another_book_keeper) { create(:user, current_workspace_id: another_company.id) }

      before do
        another_owner.add_role :owner, another_company
        another_admin.add_role :admin, another_company
        another_employee.add_role :employee, another_company
        another_book_keeper.add_role :book_keeper, another_company
      end

      it "does not grants permission" do
        expect(described_class).not_to permit(another_admin, client)
        expect(described_class).not_to permit(another_owner, client)
        expect(described_class).not_to permit(another_employee, client)
        expect(described_class).not_to permit(another_book_keeper, client)
      end
    end
  end

  describe "#permitted_attributes" do
    subject { described_class.new(admin, company).permitted_attributes }

    it "returns array of a permitted attributes" do
      expect(subject).to match_array(%i[name email phone address logo])
    end
  end

  describe "policy_scope" do
    let(:another_company) { create(:company) }
    let(:client_2) { create(:client, company:) }
    let!(:client_3) { create(:client, company:, name: "Alpha") }
    let(:client_4) { create(:client, company: another_company) }
    let(:project_1) { create(:project, client:) }
    let(:project_2) { create(:project, client: client_2) }
    let(:project_3) { create(:project, client:) }
    let(:project_4) { create(:project, client: client_2) }

    before do
      create(:project_member, project: project_1, user: employee)
      project_membership = create(:project_member, project: project_2, user: employee)
      create(:project_member, project: project_4, user: employee)
      project_3.discard!
      client_2.discard!
      project_membership.discard!
    end

    context "when user is an admin/owner" do
      it "returns the list of allowed clients" do
        result = ClientPolicy::Scope.new(admin, company).resolve
        expect(result.pluck(:id)).to eq([client_3.id, client.id])
      end
    end

    context "when user is employee" do
      it "returns only allowed clients" do
        result = ClientPolicy::Scope.new(employee, company).resolve
        expect(result.count).to eq(1)
        expect(result.first.id).to eq(client.id)
      end
    end
  end
end
