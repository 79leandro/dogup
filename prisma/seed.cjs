// Seed script for DOGUP Contábil
// Run with: node prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv/config');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log('🌱 Starting database seed...');

	// Create demo empresa
	const empresa = await prisma.empresa.upsert({
		where: { slug: 'dogup-assessoria' },
		update: {},
		create: {
			nome: 'DOGUP Assessoria Contábil',
			slug: 'dogup-assessoria'
		}
	});
	console.log(`✅ Empresa created: ${empresa.nome}`);

	// Create Perfis and Permissoes
	const permKeys = [
		'MENU_DASHBOARD', 'MENU_CLIENTES', 'MENU_OBRIGACOES', 'MENU_DCTFWEB', 
		'MENU_SITUACAO_FISCAL', 'MENU_CERTIDOES', 'MENU_PARCELAMENTOS', 
		'MENU_CAIXA_POSTAL', 'MENU_CERTIFICADOS', 'MENU_SIMPLES_NACIONAL', 
		'MENU_PER_DCOMP', 'MENU_GERAL_FERRAMENTAS', 'MENU_GERAL_FISCAL', 'MENU_GERAL_OBRIGACOES'
	];

	for (const codigo of permKeys) {
		await prisma.permissao.upsert({
			where: { codigo },
			update: {},
			create: { codigo, descricao: `Acesso a ${codigo}` }
		});
	}

	const allPerms = await prisma.permissao.findMany();

	const perfilAdmin = await prisma.perfil.upsert({
		where: { nome_empresaId: { nome: 'ADMIN', empresaId: empresa.id } },
		update: { isAdmin: true },
		create: {
			nome: 'ADMIN',
			isAdmin: true,
			empresaId: empresa.id
		}
	});
	console.log(`✅ Perfil ADMIN created`);

	const perfilOperador = await prisma.perfil.upsert({
		where: { nome_empresaId: { nome: 'OPERADOR', empresaId: empresa.id } },
		update: {},
		create: {
			nome: 'OPERADOR',
			isAdmin: false,
			empresaId: empresa.id,
			permissoes: {
				connect: allPerms.slice(0, 3).map(p => ({ id: p.id })) // Apenas algumas permissoes demo
			}
		}
	});
	console.log(`✅ Perfil OPERADOR created`);

	// Create demo user
	const hashedPassword = await bcrypt.hash('admin123', 10);
	const usuario = await prisma.usuario.upsert({
		where: { email: 'admin@dogup.com.br' },
		update: {},
		create: {
			email: 'admin@dogup.com.br',
			senha: hashedPassword,
			nome: 'Administrador',
			cargo: 'Gerente',
			empresaId: empresa.id,
			perfilId: perfilAdmin.id
		}
	});
	console.log(`✅ User Admin created: ${usuario.email}`);

	const operador = await prisma.usuario.upsert({
		where: { email: 'operador@dogup.com.br' },
		update: { perfilId: perfilOperador.id },
		create: {
			email: 'operador@dogup.com.br',
			senha: hashedPassword,
			nome: 'Operador de Teste',
			cargo: 'Assistente',
			empresaId: empresa.id,
			perfilId: perfilOperador.id
		}
	});
	console.log(`✅ User Operador created: ${operador.email}`);

	// Create demo clientes
	const clientes = [
		{
			cnpj: '12345678000190',
			nomeRazao: 'Empresa Alpha Ltda',
			nomeFantasia: 'Alpha',
			regime: 'SIMPLES_NACIONAL',
			situacaoFiscal: 'REGULAR',
			logradouro: 'Rua das Flores, 123',
			cidade: 'São Paulo',
			uf: 'SP',
			cep: '01001000',
			email: 'contato@alpha.com.br',
			telefone: '(11) 99999-9999',
			responsavelTecnico: 'João Contador'
		},
		{
			cnpj: '98765432000154',
			nomeRazao: 'Comercial Beta S.A.',
			nomeFantasia: 'Beta S.A.',
			regime: 'NORMAL',
			situacaoFiscal: 'IRREGULAR',
			logradouro: 'Av. Brasil, 456',
			cidade: 'Rio de Janeiro',
			uf: 'RJ',
			cep: '20010000',
			email: 'contato@beta.com.br',
			telefone: '(21) 88888-8888',
			responsavelTecnico: 'Maria Contadora'
		},
		{
			cnpj: '45678901000123',
			nomeRazao: 'Serviços Gamma Eireli',
			nomeFantasia: 'Gamma Serviços',
			regime: 'SIMPLES_NACIONAL',
			situacaoFiscal: 'REGULARIZADO',
			logradouro: 'Rua dos Serviços, 789',
			cidade: 'Belo Horizonte',
			uf: 'MG',
			cep: '30110000',
			email: 'contato@gamma.com.br',
			telefone: '(31) 77777-7777',
			responsavelTecnico: 'Pedro Contador'
		},
		{
			cnpj: '78901234000167',
			nomeRazao: 'Indústria Delta Ltda',
			nomeFantasia: 'Delta Indústria',
			regime: 'NORMAL',
			situacaoFiscal: 'REGULAR',
			logradouro: 'Av. Industrial, 1000',
			cidade: 'Curitiba',
			uf: 'PR',
			cep: '80010000',
			email: 'contato@delta.com.br',
			telefone: '(41) 66666-6666',
			responsavelTecnico: 'Ana Contadora'
		},
		{
			cnpj: '34567890000145',
			nomeRazao: 'Tech Solutions Eireli',
			nomeFantasia: 'Tech Solutions',
			regime: 'SIMPLES_NACIONAL',
			situacaoFiscal: 'IRREGULAR',
			logradouro: 'Rua da Tecnologia, 200',
			cidade: 'Florianópolis',
			uf: 'SC',
			cep: '88010000',
			email: 'contato@techsolutions.com.br',
			telefone: '(48) 55555-5555',
			responsavelTecnico: 'Carlos Contador'
		}
	];

	for (const clienteData of clientes) {
		const cliente = await prisma.cliente.upsert({
			where: { cnpj: clienteData.cnpj },
			update: {},
			create: {
				...clienteData,
				empresaId: empresa.id
			}
		});
		console.log(`✅ Cliente created: ${cliente.nomeRazao}`);

		// Create some obligations for each cliente
		const currentYear = new Date().getFullYear();
		const obligationTypes = ['DCTFWEB', 'GFIP', 'DIRF'];
		const statuses = ['ENTREGUE', 'NAO_ENTREGUE', 'EM_PROCESSAMENTO', 'ENTREGUE'];

		for (let mes = 1; mes <= 3; mes++) {
			const tipo = obligationTypes[Math.floor(Math.random() * obligationTypes.length)];
			const status = statuses[Math.floor(Math.random() * statuses.length)];

			await prisma.obrigacao.create({
				data: {
					clienteId: cliente.id,
					tipo,
					ano: currentYear,
					mes,
					status
				}
			});
		}
		console.log(`   - Obrigações adicionadas para ${cliente.nomeRazao}`);

		// Create some certificates
		const certificados = [
			{
				tipo: 'A1',
				cnpj: '12345678000190',
				validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
				status: 'VALIDO'
			},
			{
				tipo: 'A3',
				cnpj: '12345678000190',
				validade: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
				status: 'VENCIDO'
			}
		];

		for (const certData of certificados) {
			await prisma.certificado.create({
				data: {
					...certData,
					clienteId: cliente.id
				}
			});
		}

		// Create some parcelamentos
		if (cliente.regime === 'SIMPLES_NACIONAL') {
			await prisma.parcelamento.create({
				data: {
					clienteId: cliente.id,
					tipo: 'SIMPLES_NACIONAL',
					total: 50000,
					parcelas: 60,
					parcelasEmAtraso: cliente.situacaoFiscal === 'IRREGULAR' ? 3 : 0,
					inicio: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
				}
			});
		}

		// Create some messages
		const mensagens = [
			{
				titulo: 'Notificação de Regularização',
				conteudo: 'Sua empresa foi incluída no programa de regularização.',
				tipo: 'NOTIFICACAO',
				relevancia: 'RELEVANTE',
				lida: false,
				data: new Date()
			},
			{
				titulo: 'Intimação para regularização',
				conteudo: 'Regularize suas obrigações acessórias no prazo de 30 dias.',
				tipo: 'INTIMACAO',
				relevancia: 'RELEVANTE',
				lida: false,
				data: new Date()
			}
		];

		for (const msgData of mensagens) {
			await prisma.mensagem.create({
				data: {
					...msgData,
					clienteId: cliente.id
				}
			});
		}
	}

	console.log('\n🎉 Seed completed successfully!');
	console.log('\n📋 Login credentials:');
	console.log('   Admin: admin@dogup.com.br / admin123');
	console.log('   Operador: operador@dogup.com.br / admin123');
}

main()
	.catch((e) => {
		console.error('❌ Seed failed:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
