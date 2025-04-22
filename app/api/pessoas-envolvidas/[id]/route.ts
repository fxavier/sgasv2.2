import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET a specific person by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const person = await db.pessoaEnvolvida.findUnique({
      where: {
        id,
      },
      include: {
        departamento: true,
      },
    });

    if (!person) {
      return NextResponse.json({ error: 'Person not found' }, { status: 404 });
    }

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      departamento: {
        id: person.departamento.id,
        name: person.departamento.name,
      },
      outrasInformacoes: person.outrasInformacoes,
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson);
  } catch (error) {
    console.error('Error fetching person:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person' },
      { status: 500 }
    );
  }
}

// PUT update a person
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const { nome, departamento, outrasInformacoes } = body;

    if (!nome || !departamento || !outrasInformacoes) {
      return NextResponse.json(
        { error: 'Name, department, and additional information are required' },
        { status: 400 }
      );
    }

    // Check if department exists
    const departmentExists = await db.department.findUnique({
      where: {
        id: departamento.id,
      },
    });

    if (!departmentExists) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    const person = await db.pessoaEnvolvida.update({
      where: {
        id,
      },
      data: {
        nome,
        departamentoId: departamento.id,
        outrasInformacoes,
      },
      include: {
        departamento: true,
      },
    });

    // Format the response to match frontend expectations
    const formattedPerson = {
      id: person.id,
      nome: person.nome,
      departamento: {
        id: person.departamento.id,
        name: person.departamento.name,
      },
      outrasInformacoes: person.outrasInformacoes,
      created_at: person.createdAt.toISOString(),
      updated_at: person.updatedAt.toISOString(),
    };

    return NextResponse.json(formattedPerson);
  } catch (error) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { error: 'Failed to update person' },
      { status: 500 }
    );
  }
}

// DELETE a person
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Check if there are any reports using this person
    const reportsUsingPerson = await db.relatorioAcidenteIncidente.count({
      where: {
        pessoaEnvolvidaId: id,
      },
    });

    if (reportsUsingPerson > 0) {
      return NextResponse.json(
        { error: 'Cannot delete person that is in use by incident reports' },
        { status: 400 }
      );
    }

    await db.pessoaEnvolvida.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      { error: 'Failed to delete person' },
      { status: 500 }
    );
  }
}
